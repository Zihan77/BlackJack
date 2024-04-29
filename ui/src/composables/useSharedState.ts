import { ref, Ref } from 'vue';

interface SharedState {
  volume: number;
}

const sharedState: Ref<SharedState> = ref({
  volume: 50, // Default volume level
});

export function useSharedState() {
  return {
    sharedState
  };
}
