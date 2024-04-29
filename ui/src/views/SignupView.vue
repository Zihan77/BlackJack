<template>
    <div>
      <SignupPage />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import SignupPage from '@/components/SignupPage.vue';
  
  export default defineComponent({
    name: 'SignupView',
    components: {
        SignupPage,
    },
  });
  </script>