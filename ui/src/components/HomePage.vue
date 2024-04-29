<template>
  <link href='https://fonts.googleapis.com/css?family=Style Script' rel='stylesheet'>
  <link href='https://fonts.googleapis.com/css?family=Special Elite' rel='stylesheet'>
  <div class="home-page">
    <div class="content">
      <img class="cards-image" src="@/assets/cards.svg" alt="Cards Image" />
      <div class="text-content">
        <h1 class="title">Blackjack Buddy</h1>
        <div v-if="isLoggedIn" class="button-container">
          <button class="login-button" @click="startGame">Start Game</button>
          <button class="login-button" @click="toSetting">Settings</button>
          <button class="login-button" @click="logout">Log Out</button>
        </div>
        <button v-else class="login-button" @click="$router.push('/auth/login')">Login</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'HomePage',
  setup() {
    const isLoggedIn = ref(false);
    const router = useRouter();
    var playerId = ref('');

    onMounted(() => {
      isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true';      
      const storedPlayerId = localStorage.getItem('playerId');
      if (storedPlayerId) {
        playerId.value = storedPlayerId;
      }
    });

    const logout = () => {
      localStorage.setItem('isLoggedIn', 'false');
      console.log("Logout process initiated");
      isLoggedIn.value = false;
      router.push("/")
    };

    const startGame = () => {
      if (playerId.value) {
        router.push(`/${playerId.value}/gaming`)
      } else {
        console.error('Player ID is not set');
      }
    };

    const toSetting = () => {
      if (playerId.value) {
        router.push(`/${playerId.value}/settings`)
      } else {
        console.error('Player ID is not set');
      }
    }

    return { isLoggedIn, logout, startGame, toSetting };
  }
};
</script>

<style scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: radial-gradient(circle, #078029, #09571F);
  /* Radial gradient fill */
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
}

.cards-image {
  width: 35%;
  /* Adjusts the size */
  height: auto;
  /* Maintain aspect ratio */
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-family: 'Style Script';
  color: #FFD700;
  /* Gold-like color */
  font-size: 6rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px #000000;
  margin-bottom: 10rem;
  /* Adjusted margin */
  margin-top: 1rem;
  /* Added margin */
}


.login-button {
  padding: 1.5rem 2.5rem;
  /* Increase padding to make the button larger */
  background-color: #444;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  /* Increase font size */
  font-family: 'Special Elite';
  box-shadow: 3px 3px 6px #000000;
  transition: background-color 0.3s ease;
  margin-top: 0.8rem;
  min-width: 200px;
  /* Added margin */
}


.login-button:hover {
  background-color: #555;
}

.button-container {
  display: flex;
  flex-direction: column;
  /* Stack children vertically */
  align-items: center;
  /* Center-align items horizontally */
  gap: 2rem;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }

  .cards-image {
    width: 60%;
    /* Larger on smaller screens */
    margin-bottom: 1rem;
  }

  .title {
    font-size: 2.5rem;
  }

  .login-button {
    padding: 0.75rem 1.5rem;
  }
}
</style>
