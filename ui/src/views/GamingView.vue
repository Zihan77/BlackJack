<template>
  <link href='https://fonts.googleapis.com/css?family=Special Elite' rel='stylesheet'>
  <link href='https://fonts.googleapis.com/css?family=Style Script' rel='stylesheet'>
  <link href="https://fonts.googleapis.com/css2?family=Spirax&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Aladin&family=Sniglet:wght@400;800&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Londrina+Sketch&family=Spirax&display=swap" rel="stylesheet">
  <div class="betting-page" :class="{ 'active': !showWaitingModal }">
    <div v-if="showWaitingModal" class="overlay">
      <img src="@/assets/icons/waiting.svg" alt="Waiting Icon" class="waiting-icon">
      <span class="waiting-text">Waiting for other players...</span>
    </div>
    <div class="hands-container">
      <div class="hand-section dealer-section">
        <h2 v-if="allStood" class="hand-label">Dealer - Score: {{ dealerScore }}</h2>
        <h2 v-else-if="!showDealer" class="hand-label">Dealer - Score: {{ dealerScoreBeforeStood }}</h2>
        <div v-if="!showDealer && !allStood" class="dealer-hand">
          <CardComponent v-if="dealerHand.length > 0" :key="dealerHand[0].rank + dealerHand[0].suit[0]"
            :card="dealerHand[0]" :isFaceUp="true" />
          <CardComponent v-if="dealerHand.length > 0" :key="'DummyCard'" :card="{ rank: '??', suit: '??' }" :isFaceUp="false" />
        </div>
        <div v-if="allStood" class="dealer-hand">
          <!-- Show all cards face up when all players have stood, but dealer is not normally shown -->
          <CardComponent v-for="card in dealerHand" :key="card.rank + card.suit[0]" :card="card" :isFaceUp="true" />
        </div>
      </div>

      <div v-if="!showDealer" class="hand-section player-section">
        <h2 class="hand-label">Player - Score: {{ playerScore }}</h2>
        <div class="player-hand">
          <CardComponent v-for="card in playerHand" :key="card.rank + card.suit[0]" :card="card" :isFaceUp="true" />
        </div>
      </div>
    </div>

    <div class="player-actions">
      <button @click="hit">Hit</button>
      <button @click="standPlayer">Stand</button>
      <!-- <button @click="readyForNextRound">Ready</button> -->
    </div>

    <div class="users-container">
      <UserComponent v-for="player in players" :key="player.id" :user="player" :isStarVisible=false />
    </div>

    <BetModalComponent v-if="showBetModal" @close="toggleBetModal" @submitBet="onSubmitBet" />

    <div v-if="showResultModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>Round Results</h2>
        <div class="results-container">
          <div v-for="(result, index) in roundResults" :key="index" class="result-item">
            <h3>{{ result.playerName }}</h3>
            <p>{{ result.outcome }} - Score: {{ result.playerScore }}</p>
          </div>
        </div>
        <button v-if="isFinalRound" @click="showResults" class="ready-button">Show Final Standings</button>
        <button v-else="isFinalRound" @click="closeModal" class="ready-button">Ready for Next Round</button>
      </div>
    </div>

    <div class="footer">
      <div>
        Round {{ currentRound }}/5
      </div>
      <div>
        Current Phase: {{ currentPhase }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';
import HeaderComponent from '../components/game/HeaderComponent.vue';
import UserComponent from '../components/game/UserComponent.vue';
import BetModalComponent from '../components/game/BetModalComponent.vue';
import CardComponent from '../components/game/CardComponent.vue';

const SUITS = ["hearts", "diamonds", "clubs", "spades"];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const Outcome = ['Win', 'Lose', 'Tie', 'In Game']

export interface Card {
  rank: typeof RANKS[number]
  suit: typeof SUITS[number]
}

export interface Player {
  id: string
  name: string
  avatar?: string
  slogan?: string
  cards: Card[]
  currentHand: number
  currentBet: number
  remainCoins: number
  stand: boolean
  newRound: boolean
  outcome: typeof Outcome[number]
}

export type GamePhase = 'Waiting for Players' | 'Place Bet' | 'In Round' | 'End Round' | 'Game Over'

interface RoundResult {
  outcome: string;
  playerId: string;
  playerName: string;
  playerScore: number;
}

interface GameResult {
  playerName: string;
  playerCoin: number;
}

export default defineComponent({
  components: {
    HeaderComponent,
    UserComponent,
    BetModalComponent,
    CardComponent
  },
  props: {
    playerId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const socket = io('http://localhost:31001'); // Replace with your actual server URL
    const dealerHand = ref<Card[]>([]);
    const playerHand = ref<Card[]>([]);
    const dealerScore = ref(0);
    const playerScore = ref(0);
    const dealerScoreBeforeStood = ref(0);
    const players = ref<Player[]>([]);
    const currentRound = ref(0);
    const showBetModal = ref(false);
    const currentPlayerName = ref('');
    const showDealer = ref(false);
    const allStood = ref(false);
    const currentPhase = ref<GamePhase>('Waiting for Players')
    const showWaitingModal = ref(true);
    const roundResults = ref<RoundResult[]>([]);
    const gameResults = ref<GameResult[]>([]);
    const showResultModal = ref(false);
    const isFinalRound = computed(() => currentRound.value >= 2);
    const router = useRouter(); // Use if you're using vue-router

    async function fetchUserData(playerId: string) {
      try {
        const response = await fetch(`http://localhost:31001/api/users/${playerId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        return userData;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }

    onMounted(() => {
      fetchUserData(props.playerId).then(userData => {
        let avatar = 'default.png'; // Default value for avatar

        if (userData.gender === 'male') {
          avatar = 'male.png';
        } else if (userData.gender === 'female') {
          avatar = 'female.png';
        }
        
        // Now all this runs after userData is fetched
        socket.emit('join-game', userData.username, 100, avatar, userData.slogan);
      });
    });

    onUnmounted(() => {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected as user left the gaming page.");
      }
    });

    socket.on('update-players', (currentPlayers) => {
      players.value = currentPlayers;
    });

    socket.on('new-card', (player: Player) => {
      playerHand.value = player.cards
      updateScores();
      if (calculateScore(playerHand.value) > 21) {
        alert("Bust!")
      }
    });

    socket.on('start-game', (message, dealer) => {
      currentRound.value += 1
      currentPhase.value = 'Place Bet'
      showWaitingModal.value = false
      console.log(message);
      toggleBetModal();
      dealerHand.value = dealer.cards
      allStood.value = false
      showDealer.value = true
    });

    socket.on('bet-placed', (player) => {
      if (player.id === socket.id) {  // Check if the current player is the one who placed the bet
        showWaitingModal.value = true
        playerHand.value = player.cards // Make cards visible after betting
      }
      if (dealerHand) {
        dealerScoreBeforeStood.value = calculateScore([dealerHand.value[0]])
      }
      updateScores()
      console.log("playerHand", playerHand)
    });

    socket.on('start-round', (message, updatedPlayers) => {
      players.value = updatedPlayers
      showWaitingModal.value = false
      currentPhase.value = 'In Round'
      console.log(message);
    });

    socket.on('error', (errorMessage) => {
      alert(errorMessage);
    });

    socket.on('all-stood', (dealer) => {
      allStood.value = true
      currentPhase.value = 'End Round'
      showWaitingModal.value = false
      dealerHand.value = dealer.cards
      updateScores()
    });

    socket.on('game-evaluated', (results, round, updatedPlayers) => {
      console.log("round: ", round)
      console.log("game-evaluated", results)
      players.value = updatedPlayers
      roundResults.value = results
      showResultModal.value = true;
    });

    socket.on('round-ended', (message) => {
      console.log("round-ended", message)
    });

    socket.on('game-ended', (message, results) => {
      console.log("game-ended", message)
      gameResults.value = results
      currentPhase.value = 'Game Over'
    });

    function hit() {
      if (calculateScore(playerHand.value) <= 21) {
        socket.emit('hit', socket.id);
      } else {
        alert("You are already bust!");
      }
    }

    function standPlayer() {
      socket.emit('stand', socket.id);
      showWaitingModal.value = true
    }

    function toggleBetModal() {
      showBetModal.value = !showBetModal.value;
    }

    function closeModal() {
      showResultModal.value = false;
      readyForNextRound();
    }

    function onSubmitBet(betAmount: Number) {
      // Implement your submit bet logic here
      console.log('Bet submitted:', betAmount);
      socket.emit('place-bet', betAmount);  // Emitting the place-bet event to the server
      showDealer.value = false
      allStood.value = false
      toggleBetModal();
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

    function updateScores() {
      dealerScore.value = calculateScore(dealerHand.value);
      playerScore.value = calculateScore(playerHand.value);
    }

    function readyForNextRound() {
      console.log('Player is ready for the next round.');
      socket.emit('new-round', socket.id);
      showWaitingModal.value = true;
    }

    // Method to show final standings
    const showResults = () => {
      // Sort the game results array by playerCoin in descending order
      const sortedResults = gameResults.value.sort((a, b) => b.playerCoin - a.playerCoin);

      // Convert the sorted array to a JSON string
      const resultsJson = JSON.stringify(sortedResults);
      console.log(resultsJson)
      router.push({
        path: '/result',
        query: { gameResults: resultsJson }
      });
    };

    return {
      currentPhase,
      dealerHand,
      playerHand,
      dealerScore,
      playerScore,
      players,
      currentRound,
      showBetModal,
      currentPlayerName,
      showDealer,
      allStood,
      hit,
      standPlayer,
      toggleBetModal,
      onSubmitBet,
      dealerScoreBeforeStood, 
      readyForNextRound,
      showWaitingModal,
      roundResults,
      showResultModal,
      closeModal,
      showResults,
      isFinalRound,
    };
  }
});
</script>

<style scoped>
.betting-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(circle, #078029, #09571F);
  color: #fff;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  pointer-events: none;
}

.betting-page.active {
  pointer-events: auto; /* Re-enable interactions when not waiting */
}

.hands-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
}

.hand-section {
  text-align: center;
  width: 100%;
}

.hand-label {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
  font-family: 'Style Script';
  /* Adjust if you have a specific color scheme */
}

.users-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
}

.bet-modal-component {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s;
}

.player-actions {
  display: flex;
  justify-content: center;
  gap: 3rem;
  /* Adjust the space between buttons as needed */
  margin-top: 2rem;
  margin-bottom: 2rem;
  /* Adds space below the player actions */
}

.player-actions button {
  width: 100px;
  /* Equal width and height make the button round */
  height: 100px;
  line-height: 80px;
  /* Ensures the text is centered vertically */
  padding: 0;
  /* Remove padding to keep the button round */
  font-size: 1.5rem;
  border: none;
  border-radius: 50%;
  /* This will make the button round */
  background-color: rgba(0, 0, 0, 0.7);
  /* Semi-transparent black background */
  color: white;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Soft shadow for depth */
  transition: background-color 0.3s, transform 0.3s;
  text-align: center;
  /* Remove margins if there are any */
  font-family: 'Special Elite';
}

.player-actions button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  /* Light color on hover */
  transform: scale(1.05);
  /* Slightly enlarges the button on hover */
}

.player-actions button:active {
  background-color: rgba(255, 255, 255, 0.3);
  /* Even lighter on active */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  /* Smaller shadow to give a pressed effect */
}


.bet-modal-component.show {
  opacity: 1;
  visibility: visible;
}

.bet-modal-component .bet-modal {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  transition: transform 0.3s ease-out;
  transform: translateY(-20px);
}

.bet-modal-component.show .bet-modal {
  transform: translateY(0);
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  padding: 1rem 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer>div {
  margin: 0 20px;
  /* Adjust the 10px to increase or decrease the space */
}

.dealer-hand,
.player-hand {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  /* Adjust the gap between cards as needed */
}

.card {
  /* Make sure each card has a set width and does not grow or shrink */
  flex: 0 0 auto;
}

.card img {
  max-width: 100px;
  /* Adjust to your preference */
  height: auto;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); /* Grey out the screen */
  z-index: 100; /* High z-index to cover other contents */
  pointer-events: auto; /* Enable pointer events to block interactions */
  display: flex;
  justify-content: center;
  align-items: center; /* Center the text and image vertically and horizontally */
  flex-direction: column; /* Stack elements vertically */
}

.waiting-icon {
  width: 300px; /* Fixed width, adjust as necessary */
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 20px; /* Space between the icon and text */
}

.waiting-text {
  color: white; /* High contrast color */
  font-size: 2rem; /* Large font size for better visibility */
  text-align: center;
  font-family: "Spirax"
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal {
  background: beige;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 500px;
  text-align: center;
}

.modal h2 {
  color: #000; /* Change font color to black */
  text-align: center; /* Center the title */
  margin-bottom: 1rem; /* Spacing below the title */
  font-size: 60px;
  color: rgb(148, 148, 6);
  font-family: 'Style Script';
}

.result-item h3 {
  color: #000; /* Change font color to black */
  font-family: "Londrina Sketch";
}
.result-item p {
  color: #000; /* Change font color to black */
  font-family: "Sniglet";
}

.result-item {
  background-color: #fff; /* White background for result items */
  padding: 10px;
  border-radius: 8px; /* Rounded corners */
  margin-bottom: 1rem; /* Spacing between result items */
  background-color: azure;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.results-container {
  max-width: 400px; /* Maintain original width */
  margin: auto; /* Center it horizontally */
}

.modal button {
  background-color: #4CAF50; /* Green background like the place bet button */
  color: white; /* White text */
  padding: 10px 20px; /* Padding inside the button */
  border: none; /* No border */
  border-radius: 5px; /* Rounded corners */
  cursor: pointer; /* Pointer cursor on hover */
  font-size: 1rem; /* Font size */
  display: block; /* Block display to fill the width */
  width: 100%; /* Full width */
  text-align: center; /* Center the text */
  margin-top: 20px; /* Spacing above the button */
  transition: background-color 0.3s; /* Transition for interaction */
  max-width: 300px;
  margin: auto;
  font-family: 'Special Elite';
}

.modal button:hover {
  background-color: #45a049; /* Slightly darker green on hover */
}

@media (max-width: 600px) {
  .users-container {
    flex-direction: column;
    align-items: center;
  }

  .footer {
    position: relative;
  }
}
</style>