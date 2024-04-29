<template>
    <div>
      <SettingPage :playerId="playerId!" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import SettingPage from '@/components/SettingPage.vue';
  
  export default defineComponent({
    name: 'SettingView',
    components: {
      SettingPage,
    },
    props: {
      playerId: String
    }
  });
  </script>