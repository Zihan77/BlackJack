<template>
  <div id="app">
    <router-view />
    <button @click="goHome" class="home-button">
      <img src="@/assets/icons/home-white.svg" alt="Go Home" /> <!-- Home icon -->
    </button>
    <button @click="toggleMusic" class="music-button">
      <img v-if="isMusicPlaying" src="@/assets/icons/music-pause.svg" alt="Pause Music" />
      <img v-else src="@/assets/icons/music-note.svg" alt="Play Music" />
    </button>
    <audio ref="backgroundAudio" :src="backgroundMusic" loop></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import backgroundMusic from '@/assets/musics/background-music.mp3'; // Importing music file
import { useSharedState } from '@/composables/useSharedState';

export default defineComponent({
  name: 'App',
  setup() {
    const { sharedState } = useSharedState();
    const router = useRouter();
    const backgroundAudio = ref<HTMLAudioElement | null>(null);
    const isMusicPlaying = ref(false);

    function toggleMusic() {
      if (backgroundAudio.value) {
        if (isMusicPlaying.value) {
          backgroundAudio.value.pause();
          isMusicPlaying.value = false; // Update the state to reflect that music is no longer playing
        } else {
          backgroundAudio.value.play()
            .then(() => {
              isMusicPlaying.value = true; // Music started successfully
            })
            .catch((e) => {
              console.error("Audio playback failed:", e);
            });
        }
      }
    }

    function goHome() {
      router.push('/'); // Navigate to the home page
    }

    watch(() => sharedState.value.volume, (newVolume) => {
      if (backgroundAudio.value) {
        backgroundAudio.value.volume = newVolume / 100;
      }
    });

    return {
      backgroundAudio,
      toggleMusic,
      isMusicPlaying,
      backgroundMusic,
      goHome
    };
  }
});
</script>

<style>
.home-button {
  position: fixed;
  bottom: 10px;
  right: 50px;
  z-index: 100;
  background: none;
  border: none;
  cursor: pointer;
}

.home-button img {
  width: 30px;
  height: 30px;
}

.music-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 100;
  background: none;
  border: none;
  cursor: pointer;
}

.music-button img {
  width: 30px;
  height: 30px;
}
</style>
