<template>
    <div>
      <LoginPage />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import LoginPage from '@/components/LoginPage.vue';
  
  export default defineComponent({
    name: 'LoginView',
    components: {
      LoginPage,
    },
  });
  </script>