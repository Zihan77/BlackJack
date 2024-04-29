<template>
  <link href="https://fonts.googleapis.com/css2?family=Aladin&family=Sniglet:wght@400;800&display=swap" rel="stylesheet">
  <link href='https://fonts.googleapis.com/css?family=Style Script' rel='stylesheet'>
    <div class="final-standings-page">
      <div class="standings-container">
        <h1 class="standings-title">Final Standing</h1>
        <ul class="standings-list">
          <li v-for="(result, index) in gameResults" :key="result.playerName" class="player">
            <span class="crown-icon" v-if="index < 1">👑</span>
            <span>{{ index + 1 }}. {{ result.playerName }} ${{ result.playerCoin }}</span>
          </li>
        </ul>
        <button @click="startNewGame" class="new-game-button">Home Page</button>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router'; // Import useRouter to use the router programmatically

  export default {
    props: {
      gameResults: {
        type: Array,
        default: () => []
      },
    },
    setup() {
      const router = useRouter(); // Access the router instance

      const startNewGame = () => {
        router.push('/'); // Navigate to the home page
      };

      return { startNewGame };
    }
  }
  </script>
  
  <style scoped>
  .final-standings-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: radial-gradient(circle, #078029, #09571F);
  }
  
  .standings-container {
    padding: 4em;
    background: rgba(0, 0, 0, 0.7); /* Slightly more transparent */
    border-radius: 20px;
    text-align: center;
    width: 60%; /* Responsive width */
    max-width: 600px; /* Maximum width */
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease; /* Smooth scaling */
    display: flex; /* Use flexbox layout */
    flex-direction: column; /* Stack children vertically */
    align-items: center; /* Center-align items horizontally */
    justify-content: center; /* Center items vertically (optional, if needed) */
  }
  
  .standings-title {
    color: #ffd700; /* Gold color */
    font-size: 4rem; /* Increased size */
    margin-bottom: 2rem; /* Increased spacing */
    font-family: 'Aladin';
  }
  
  .standings-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    color: #fff; /* White color */
    width: 100%; /* Full width of the container */
    display: flex;
    flex-direction: column;
    align-items: center; /* Align list items to the center */
    font-size: 2rem; /* Increased size */
    font-family: "Sniglet";
  }
  
  .player {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1rem;
    font-size: 2rem;
    position: relative; /* For absolute positioning of crown icon */
  }

  .crown-icon {
    position: absolute; /* Position the crown absolutely relative to the player div */
    left: -25px; /* Shift crown to the left; adjust value as needed */
    width: 20px; /* Fixed width for crown */
  }

  .player span:not(.crown-icon) {
    margin-left: 25px; /* Make space for the crown; should match the left shift of crown */
  }
  
  .new-game-button {
    background-color: gold;
    color: #078029;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.5rem; /* Increased size */
    width: 50%; /* Button width */
    margin: auto; /* Center button */
    transition: background-color 0.3s ease; /* Smooth background transition */
  }
  
  .new-game-button:hover {
    background-color: #c0b283; /* Darker gold on hover */
  }
  </style>
    
    