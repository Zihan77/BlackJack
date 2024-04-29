const SUITS = ["hearts", "diamonds", "clubs", "spades"];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const Outcome = ['Win', 'Lose', 'Tie', 'In Game']

export type GamePhase = 'Waiting for Players' | 'Place Bet' | 'In Round' | 'End Round' | 'Game Over'

export interface GameState {
  players: Player[]
  dealer: Player
  phase: GamePhase
  round: number
}

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

export class BlackjackGame {
  deck: Card[];

  constructor() {
    this.deck = [];
    this.deck = this.initializeDeck();
  }

  initializeDeck() {
    SUITS.forEach(suit => {
      RANKS.forEach(rank => {
        this.deck.push({
          rank: rank, suit: suit
        });
      });
    });
    return this.deck.sort(() => Math.random() - 0.5); // Simple shuffle
  }

  popCard(): Card {
    const card = this.deck.pop();
    if (!card) {
      throw new Error('Deck is empty, cannot deal more cards.');
    }
    return card;
  }
}