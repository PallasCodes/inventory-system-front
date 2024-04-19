import { Cookies } from 'quasar'
import { boot } from 'quasar/wrappers'

import { api } from 'src/api'
import { useAuthStore } from 'src/stores/auth-store'

export default boot(async () => {
  const authStore = useAuthStore()

  const token = Cookies.get('user_token')
  console.log('🚀 ~ boot ~ token:', token)
  const expirationDate = parseInt(Cookies.get('expirationDate'), 10)
  console.log('🚀 ~ boot ~ expirationDate:', expirationDate)
  const leftTime = expirationDate - Date.now()
  console.log('🚀 ~ boot ~ leftTime:', leftTime)

  if (!expirationDate || !token) return
  if (leftTime <= 0) return

  authStore.setToken(token)

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`

  setTimeout(() => {
    Cookies.remove('user_token')
    Cookies.remove('expirationDate')

    authStore.setToken('')
  }, expirationDate - Date.now())
})
