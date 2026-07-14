import { createRouter, createWebHistory } from 'vue-router'

// View 컴포넌트 import
import HomeView from '../views/HomeView.vue'
import BoardView from '../views/BoardView.vue'
import MapView from '../views/MapView.vue'
import ChatView from '../views/ChatView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/board',
    name: 'Board',
    component: BoardView
  },
  {
    path: '/map',
    name: 'Map',
    component: MapView
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router