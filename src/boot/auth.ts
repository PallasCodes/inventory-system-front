import { Loading, LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'

import { api } from 'src/api'
import { useAuthStore } from 'src/stores/auth-store'

export default boot(async () => {
  const token = LocalStorage.getItem('token')
  if (!token) return

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`

  try {
    Loading.show()
    await api.post('/auth/check-status')
    Loading.hide()

    const { setToken } = useAuthStore()
    setToken(token as string)
  } catch (error) {
    Loading.hide()
    console.log(error)
  }
})
