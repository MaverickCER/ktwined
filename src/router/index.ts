import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/content',
      name: 'content',
      component: () => import('../views/ContentView.vue'),
      beforeEnter: async (to, from) => {
        let currentUser = await getCurrentUser()
        // if the user is not logged in, redirect to the login page
        if (!currentUser) {
          // reject the navigation
          return { name: 'join' }
        }
      }
    },
    {
      path: '/join',
      name: 'join',
      component: () => import('../views/JoinView.vue'),
      beforeEnter: async (to, from) => {
        let currentUser = await getCurrentUser()
        // if the user is not logged in, redirect to the login page
        if (currentUser) {
          // reject the navigation
          return { name: 'content' }
        }
      }
    },
    {
      path: '/:id',
      name: 'artist',
      component: () => import('../views/ArtistView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/ErrorView.vue')
    }
  ]
})

export default router
