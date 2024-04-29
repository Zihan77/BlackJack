<template>
  <div>
    <ResultPage :gameResults="gameResults" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ResultPage from '@/components/ResultPage.vue';

export default defineComponent({
  name: 'ResultView',
  props: {
    gameResults: Array, // Define the expected type of the gameResults prop
  },
  components: {
    ResultPage,
  },
});
</script>