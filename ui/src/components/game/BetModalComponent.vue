<template>
  <div class="bet-modal-overlay" @click.self="closeModal">
    <div class="bet-modal">
      <form @submit.prevent="placeBet">
        <div class="bet-modal-header">
          <h2>Please Place Bet</h2>
        </div>
        <div class="bet-modal-body">
          <input 
            v-model.number="betAmount" 
            type="number" 
            placeholder="Enter Your Bet" 
            class="bet-input" 
            min="1" 
          />
        </div>
        <div class="bet-modal-footer">
          <button type="submit" class="place-bet-button">Place</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BetModalComponent',
  emits: ['close', 'submitBet'],
  setup(_, { emit }) {
    const betAmount = ref(0);

    function placeBet() {
      emit('submitBet', betAmount.value);
      betAmount.value = 0;
    }

    function closeModal() {
      emit('close');
    }

    return {
      betAmount,
      placeBet,
      closeModal,
    };
  },
});
</script>

<style scoped>
.bet-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.bet-modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px; /* You can adjust this as per your design */
}

.bet-modal-header h2 {
  margin: 0;
  color: #333;
  text-align: center;
}

.bet-modal-body {
  margin-top: 15px;
}

.bet-input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.bet-modal-footer {
  margin-top: 20px;
  text-align: right;
}

.place-bet-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #5cb85c;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.place-bet-button:hover {
  background-color: #4cae4c;
}

.place-bet-button:active {
  background-color: #449d44;
}

.place-bet-button:focus {
  outline: none;
}
</style>
