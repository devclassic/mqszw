import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/index.vue'
import Chat from '../views/chat.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Index,
    },
    {
      path: '/chat',
      component: Chat,
    },
  ],
})

export default router
