<template>
  <div>
    <div>
      <div class="user-bet">
        <img src="@/assets/icons/coin.svg" alt="Coins" class="coins-icon" />
        {{ user.currentBet }}
      </div>
    </div>
    <div class="user-component" :class="{ 'current-user': user.isStarVisible }" @mouseover="isHovering = true" @mouseout="isHovering = false" >
      <img :src="avatarSrc" alt="User Avatar" class="user-avatar" />
      <div class="user-info">
        <div class="user-score">
          <img src="@/assets/icons/coin.svg" alt="Coins" class="coins-icon" />
          {{ user.remainCoins }}
        </div>
        <div class="user-name">{{ user.name }}</div>
      </div>
    </div>
    <!-- <div v-show="isHovering" class="slogan">{{ user.slogan }}</div> -->
    <div v-show="isHovering" class="slogan">{{ user.slogan }}</div>
  </div>
</template>


<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue';
import defaultAvatar from '@/assets/avatars/default.png'; // Import the default avatar statically

export default defineComponent({
  name: 'UserComponent',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const avatarSrc = ref(defaultAvatar); // Initialize with default avatar
    const isHovering = ref(false); // Hover state

    // A method to load the avatar dynamically
    function loadAvatar() {
      console.log(`../../assets/avatars/${props.user.avatar}`)
      import(`../../assets/avatars/${props.user.avatar}`)
        .then(module => {
          avatarSrc.value = module.default;
        })
        .catch(error => {
          console.error('Failed to load avatar:', error);
          avatarSrc.value = defaultAvatar; // Use default avatar on error
        });
    }

    // Watch for changes in user.avatar to update dynamically
    watch(() => props.user.avatar, (newAvatar, oldAvatar) => {
      if (newAvatar !== oldAvatar) {
        loadAvatar();
      }
    }, { immediate: true });

    return { avatarSrc, isHovering };
  },
});
</script>

<style scoped>
.user-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.user-component:hover {
  transform: translateY(-5px);
}

.current-user {
  background-color: #e0f7fa;
  /* A light blue background color for the current user */
}

.user-avatar {
  width: 70px;
  /* Adjust size as needed */
  height: 70px;
  /* Adjust size as needed */
  border-radius: 50%;
  margin-bottom: 0.5rem;
  border: 3px solid #eee;
  /* Light grey border */
  object-fit: cover;
}

.user-bet {
  font-size: 1.2rem;
  color: #ffffff;
  /* Dark grey color for the score */
  margin-bottom: 0.25rem;
  display: flex;
  /* Aligns the score and coin icon horizontally */
  align-items: center;
  /* Centers the items vertically */
}

.user-score {
  font-size: 1.2rem;
  color: #333;
  /* Dark grey color for the score */
  margin-bottom: 0.25rem;
  display: flex;
  /* Aligns the score and coin icon horizontally */
  align-items: center;
  /* Centers the items vertically */
}

.coins-icon {
  width: 20px;
  /* Adjust the size as needed */
  height: 20px;
  /* Adjust the size as needed */
  margin-right: 0.5rem;
  /* Space between the score and the icon */
}

.user-star {
  color: #ffd700;
  /* Gold color for the star */
  font-size: 1.5rem;
  margin-top: 0.25rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-name {
  font-size: 1rem;
  color: #333;
  margin-top: 0.5rem;
}

.slogan {
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Add an after pseudo-element for the arrow effect */
.slogan::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  z-index: 101;
}

.hand-score {
  display: flex;
  justify-content: center;
  width: 100%;
}

@media (min-width: 768px) {
  .user-component {
    flex-direction: row;
    padding: 1rem 2rem;
  }

  .current-user {
    background-color: #b2ebf2;
    /* A slightly different background color for larger screens, if needed */
  }

  .user-avatar {
    margin-right: 1rem;
    margin-bottom: 0;
  }

  .user-star {
    margin-left: auto;
    margin-top: 0;
  }
}
</style>
