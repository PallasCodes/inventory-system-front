import { RouteRecordRaw } from 'vue-router'
import inventoryRoutes from './inventoryRoutes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../modules/main/layouts/MainLayout.vue'),
    redirect: 'home',
    children: [...inventoryRoutes],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../modules/auth/pages/LoginPage.vue'),
    meta: {
      noAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../modules/main/pages/ErrorNotFound.vue'),
  },
]

export default routes
