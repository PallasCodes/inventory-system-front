import { LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'

import { api } from 'src/api'
import { useAuthStore } from 'src/stores/auth-store'

export default boot(async () => {
  const token = LocalStorage.getItem('token')
  if (!token) return

  const { setToken } = useAuthStore()
  setToken(token as string)

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
})
