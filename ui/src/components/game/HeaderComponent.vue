<template>
  <header class="header">
    <div class="header-content">
      <img 
        src="@/assets/icons/home.svg" 
        alt="Home" 
        class="home-icon" 
        @click="goHome"
      />
      <!-- Add additional header elements here if necessary -->
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router'; // make sure you have vue-router installed

export default defineComponent({
  name: 'HeaderComponent',
  setup() {
    const router = useRouter();

    function goHome() {
      router.push('/'); // replace '/' with your home route path
    }

    return {
      goHome,
    };
  },
});
</script>

<style scoped>
.header {
  width: 100%;
  background-color: #e7e7e7; /* Light grey background */
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(246, 245, 245, 0.1);
}

.header-content {
  max-width: 1200px; /* Adjust according to your layout */
  margin: 0 auto;
  display: flex;
  align-items: center;
}

.home-icon {
  cursor: pointer;
  height: 24px; /* Adjust if needed */
  width: 24px; /* Adjust if needed */
  margin-right: 1rem; /* Space after icon, adjust if needed */
  transition: transform 0.2s ease-in-out;
}

.home-icon:hover {
  transform: scale(1.1);
}
</style>
