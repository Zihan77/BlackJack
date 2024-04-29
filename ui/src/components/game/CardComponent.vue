<template>
  <div class="card">
    <!-- Conditionally show the card face or back -->
    <img :src="isFaceUp ? cardImageSrc : backImageSrc" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import backImageSrc from '@/assets/cards/card_back.png';
import defaultSrc from '@/assets/cards/Q_of_spades.png'

export default defineComponent({
  name: 'CardComponent',
  props: {
    card: {
      type: Object as PropType<{ rank: string; suit: string }>,
      required: true,
    },
    isFaceUp: {
      type: Boolean,
      default: true, // By default, the card is face up
    },
  },

  setup(props) {
    const cardImageSrc = ref(defaultSrc); // Initialize with default avatar

    // A method to load the card dynamically
    function loadCard() {
      if (props.isFaceUp) {
        import(`../../assets/cards/${props.card.rank}_of_${props.card.suit}.png`)
          .then(module => {
            cardImageSrc.value = module.default;
          })
          .catch(error => {
            console.error('Failed to load card:', error);
            cardImageSrc.value = defaultSrc; // Use default avatar on error
          });
      } else {
        import(`../../assets/cards/card_back.png`)
          .then(module => {
            cardImageSrc.value = module.default;
          })
          .catch(error => {
            console.error('Failed to load card:', error);
            cardImageSrc.value = defaultSrc; // Use default avatar on error
          });
      }
    }

    loadCard()

    return {
      backImageSrc,
      cardImageSrc,
    };
  }
});
</script>

<style scoped>
.card img {
  width: 100px;
  height: auto;
  transition: transform 0.5s ease;
}
</style>
