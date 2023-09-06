import { route } from 'quasar/wrappers'
import {
  // createMemoryHistory,
  createRouter,
  // createWebHashHistory,
  createWebHistory,
} from 'vue-router'

import routes from './mainRoutes'

import { useAuthStore } from 'src/stores/auth-store'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = createWebHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const { isLoggedIn } = useAuthStore()

    if (!to.meta.noAuth && !isLoggedIn) {
      next('/login')
    } else if (to.meta.noAuth && isLoggedIn) {
      next('')
    } else {
      next()
    }
  })

  return Router
})
