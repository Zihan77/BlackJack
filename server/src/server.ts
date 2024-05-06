import app from './app';
import { BlackjackGame, Player, GameState, Card } from "./model"

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const server = new HttpServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const game = new BlackjackGame();
let gameState: GameState = {
  players: [],
  phase: "Place Bet",
  round: 1,
  dealer: {
    id: '661cae4697332cbd3ee753a4',
    name: "Dealer",
    cards: [],
    currentHand: 0,
    currentBet: 0,
    remainCoins: 1000,
    stand: false,
    newRound: true,
    outcome: 'In Game'
  },
};

io.on('connection', (socket: Socket) => {
  console.log('A player connected.');

  socket.on('join-game', (name: string, coins: number, avatar: string, slogan: string) => {
    if (gameState.players.length >= 2) {
      socket.emit('error', 'Game room is full.');
      return;
    }
  
    const newPlayer: Player = {
      id: socket.id,
      name: name,
      avatar: avatar,
      slogan: slogan,
      cards: [],
      currentHand: 0,
      currentBet: 0,
      remainCoins: coins,
      stand: false,
      newRound: true,
      outcome: 'In Game'
    };
    gameState.players.push(newPlayer);
    console.log(`${name} has joined the game`);

    // Add the player to the room
    socket.join('gameRoom');

    socket.emit('joined', `Welcome ${name}, you have joined the blackjack table.`);
    io.emit('update-players', gameState.players);
  
    // Check if the required number of players have joined to start the game
    if (gameState.players.length === 2) {
      newRound();
    }
  });

  socket.on('new-round', (socketId) => {
    const player = gameState.players.find(p => p.id === socketId);
    if (player) {
      player.newRound = true
    }

    const allReady = gameState.players.every(player => player.newRound === true);
    if (allReady) {
      newRound()
    }
  })

  socket.on('place-bet', (betAmount: number) => {
    if (gameState.phase !== "Place Bet") {
      socket.emit('error', 'Betting is not allowed at this time.');
      return;
    }

    const player = gameState.players.find(p => p.id === socket.id);
    if (!player) {
      socket.emit('error', 'You are not a recognized player.');
      return;
    }

    if (betAmount > player.remainCoins) {
      socket.emit('error', 'Insufficient coins for this bet.');
      return;
    }

    player.currentBet = betAmount;
    player.remainCoins -= betAmount;
    console.log(`${player.name} placed a bet of ${betAmount}`);

    const card1 = game.popCard();
    const card2 = game.popCard();
    player.cards.push(card1)
    player.cards.push(card2)

    socket.emit('new-card', player);

    io.emit('bet-placed', player); // Consider also sending the visibility update to all clients if needed
    checkAllBetsPlaced();
  });

  socket.on('hit', (socketId) => {
    const player = gameState.players.find(p => p.id === socketId);
    if (player) {
      try {
        const card = game.popCard();
        player.cards.push(card)
        socket.emit('new-card', player);
      } catch (error) {
        const message = (error instanceof Error) ? error.message : 'An unexpected error occurred';
        socket.emit('error', message);
      }
    }
  });

  socket.on('stand', (socketId) => {
    const player = gameState.players.find(p => p.id === socketId);
    if (player) {
      player.stand = true
      const allStood = gameState.players.every(p => p.stand === true);

      if (allStood) {
        // If all players have stood, proceed to the next game phase
        // You could handle end-of-round logic here
        console.log("All players have stood. Proceeding to next phase.");
        gameState.dealer.currentHand = calculateScore(gameState.dealer.cards)
        console.log("currentHand:", gameState.dealer.currentHand)
        while (gameState.dealer.currentHand < 17) {
          gameState.dealer.cards.push(game.popCard());
          gameState.dealer.currentHand = calculateScore(gameState.dealer.cards);
          console.log("currentHand: ", gameState.dealer.currentHand)
        }

        // sync with frontend
        io.emit('all-stood', gameState.dealer)

        evaluateGame(); 

        // Inform all clients that the round has ended
        io.emit('round-ended', { message: "All players have stood. Round ended." });
      } else {
        // If not all players have stood, inform others about the current player's decision
        console.log(`${player.name} has decided to stand.`);

        // Optionally, emit an event to inform clients
        io.emit('player-stood', { playerId: socketId, playerName: player.name });
      }
    }
    else {
      // If no matching player was found, emit an error to the originating socket
      socket.emit('error', 'Player not found.');
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected.`);
    gameState.players = gameState.players.filter(p => p.id !== socket.id);
    if (gameState.players.length < 2) {
      gameState.phase = "Waiting for Players";
      console.log("Not enough players to continue the game.");
      io.to('gameRoom').emit('pause-game', 'Waiting for more players to join...');
    }
    io.emit('update-players', gameState.players);
  });

  function newRound() {
    const game = new BlackjackGame();

    gameState.phase = "Place Bet";
    gameState.dealer.cards = [];
    gameState.players.forEach(player => {
      player.cards = []; 
      player.currentBet = 0; 
      player.stand = false; 
    });

    const card1 = game.popCard();
    const card2 = game.popCard();
    gameState.dealer.cards.push(card1);
    gameState.dealer.cards.push(card2);
    io.to('gameRoom').emit('start-game', 'All players have joined. Game is starting, place your bets!', gameState.dealer);

    console.log("Game is starting, players can place bets now.");
  }

  function isBlackjack(player: Player) {
    return player.cards.length === 2 && player.currentHand === 21;
  }

  function evaluateGame() {
    const dealerScore = calculateScore(gameState.dealer.cards);

    gameState.players.forEach(player => {
      const playerScore = calculateScore(player.cards);
      const playerBlackjack = isBlackjack(player);
      const dealerBlackjack = isBlackjack(gameState.dealer)

      console.log("playerScore", playerScore)
      console.log("dealerScore", dealerScore, gameState.dealer.cards)

      if (playerBlackjack && !dealerBlackjack) {
        player.outcome = 'Win';
        player.remainCoins += 2 * player.currentBet
      } else if (!playerBlackjack && dealerBlackjack) {
        player.outcome = 'Lose';
      } else if (playerScore > 21) {
        player.outcome = 'Lose';
      } else if (dealerScore > 21) {
        player.outcome = 'Win';
        player.remainCoins += 2 * player.currentBet
      } else if (playerScore > dealerScore) {
        player.outcome = 'Win';
        player.remainCoins += 2 * player.currentBet
      } else if (playerScore < dealerScore) {
        player.outcome = 'Lose';
      } else {
        player.outcome = 'Tie';
      }

      player.currentBet = 0

      // Broadcast or log the outcome for each player
      console.log(`Outcome for ${player.name}: ${player.outcome}`);
    });

    // Optionally, emit these results to all clients if using sockets
    io.emit('game-evaluated', gameState.players.map(player => ({
      playerId: player.id,
      playerName: player.name,
      playerScore: calculateScore(player.cards),
      outcome: player.outcome
    })),
      gameState.round,
      gameState.players
    );
    
    gameState.players.forEach(player => {
      player.newRound = false;
    });

    gameState.round += 1
    if (gameState.round > 2) {
      io.emit('game-ended', 'Game has ended', gameState.players.map(player => ({
        playerName: player.name,
        playerCoin: player.remainCoins
      })));
      gameState.round = 1
    }
  }

  function calculateScore(hand: Card[]) {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
      if (card.rank === 'A') {
        aces += 1;
        score += 11;
      } else if (['J', 'Q', 'K'].includes(card.rank)) {
        score += 10;
      } else {
        score += parseInt(card.rank, 10);
      }
    }

    while (score > 21 && aces) {
      score -= 10;
      aces -= 1;
    }

    return score;
  }

  function checkAllBetsPlaced() {
    if (gameState.players.every(player => player.currentBet > 0)) {
      gameState.phase = "In Round";
      io.to('gameRoom').emit('start-round', 'All bets placed. Round starting...', gameState.players);
      console.log("All bets are placed, starting the round.");
    }
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});