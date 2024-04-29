import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: () => import('../views/SignupView.vue')
  },
  {
    path: '/result',
    name: 'result',
    component: () => import('../views/ResultView.vue'),
    props: (route) => {
      const results = route.query.gameResults;
      return {
        gameResults: results && typeof results === 'string' ? JSON.parse(results) : []
      };
    }
  },
  {
    path: '/:playerId/gaming',
    name: 'gaming',
    component: () => import('../views/GamingView.vue'),
    props(route) {
      return {
        playerId: route.params.playerId
      }
    }
  },
  {
    path: '/:playerId/settings',
    name: 'settings',
    component: () => import('../views/SettingView.vue'),
    props(route) {
      return {
        playerId: route.params.playerId
      }
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
