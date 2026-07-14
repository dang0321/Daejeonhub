import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // ← 추가
import './style.css'

createApp(App)
  .use(router)  // ← 추가
  .mount('#app')