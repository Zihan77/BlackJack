<template>
  <link href="https://fonts.googleapis.com/css2?family=Aladin&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Aladin&family=Sniglet:wght@400;800&display=swap" rel="stylesheet">
  <div class="settings-container">
    <div class="settings-page">
      <h1 class="settings-title">Settings</h1>
      
      <form class="settings-form" @submit.prevent="saveSettings">
        <!-- <label for="num-decks">Number of Decks</label>
        <select id="num-decks" v-model="settings.numDecks">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select> -->

        <label for="email">Email</label>
        <input type="text" id="email" v-model="settings.email">
        
        <label for="username">Username</label>
        <input type="text" id="username" v-model="settings.username">

        <!-- <label for="password">Password</label>
        <input type="password" id="password" v-model="settings.password"> -->

        <label for="gender">Gender</label>
        <select id="gender" v-model="settings.gender">
          <option value="default">Default</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label for="password">Slogan</label>
        <input type="text" id="slogan" v-model="settings.slogan">
        
        <!-- <label for="soft-17">Dealer hits on soft 17</label>
        <select id="soft-17" v-model="settings.soft17">
          <option value="on">On</option>
          <option value="off">Off</option>
        </select> -->
        
        <label for="sound">Sound</label>
        <input type="range" id="sound" v-model="settings.sound" min="0" max="100">
        
        <div class="button-container">
          <button type="submit" class="save-button">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSharedState } from '@/composables/useSharedState';

export default defineComponent({
  name: 'SettingsPage',
  props: {
    playerId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const { sharedState } = useSharedState();
    const settings = ref({
      email: '',
      username: '',
      gender: 'default',
      slogan: 'I love Blackjack Buddy!',
      sound: sharedState.value.volume,
    });

    onMounted(() => {
      fetchUserData(props.playerId);
    });

    watch(() => settings.value.sound, (newSound) => {
      sharedState.value.volume = newSound;
    });

    function saveSettings() {
      const { sound, ...settingsToSave } = settings.value; // Exclude 'sound' from the object sent to the server
      console.log(settingsToSave);
      // Use the PUT method to update user data at the backend
      const url = `http://localhost:31001/api/users/${props.playerId}`;
      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsToSave)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save settings');
        }
        return response.json();
      })
      .then(data => {
        console.log('Settings saved successfully:', data);
        alert('Settings updated successfully!');
        router.push('/'); 
      })
      .catch(error => {
        console.error('Error saving settings:', error);
        alert('Error saving settings: ' + error.message);
      });

    }

    function fetchUserData(playerId: string) {
      fetch(`http://localhost:31001/api/users/${playerId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(userData => {
          settings.value.email = userData.email;
          settings.value.username = userData.username;
          settings.value.gender = userData.gender;
          settings.value.slogan = userData.slogan;
        })
        .catch(error => {
          console.error('Failed to fetch user data:', error);
        });
    }

    return {
      settings,
      saveSettings,
    };
  },
});
</script>

<style scoped>
.settings-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(circle, #078029, #09571F);
}

.settings-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 10px;
}

.settings-title {
  font-family: 'Style Script';
  text-align: center;
  color: yellow;
  margin-bottom: 2rem;
  font-size: 5rem;
  font-family: "Aladin"
}

.settings-form label {
  display: block;
  color: white;
  margin: 1rem 0 0.5rem 0;
  min-width: 500px;
  font-family: "Sniglet"
}

.settings-form select,
.settings-form input[type="text"],
.settings-form input[type="password"],
.settings-form input[type="range"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #fff;
  box-sizing: border-box;
  border-radius: 5px;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 2rem; /* or any amount to create space above the button */
}

.settings-form .save-button {
  background-color: gold;
  color: #078029;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  min-width: 200px;
}

.settings-form .save-button:hover {
  background-color: #e7c611; /* Lighter gold color on hover */
  color: black; /* Change text color on hover */
}

</style>
