import { Loading, LocalStorage } from 'quasar'
import { boot } from 'quasar/wrappers'

import { api } from 'src/api'
import { useAuthStore } from 'src/stores/auth-store'

export default boot(async () => {
  const authStore = useAuthStore()

  const token = LocalStorage.getItem('token')
  const expirationDate = LocalStorage.getItem('expirationDate') as number

  if (!token) return

  api.defaults.headers.common['Authorization'] = `Bearer ${token}`

  try {
    Loading.show({
      message: 'Espere un momento. El sistema está cargando.',
      spinnerColor: 'primary',
    })
    await api.post('/auth/check-status')
    Loading.hide()

    const { setToken } = useAuthStore()
    setToken(token as string)

    setTimeout(() => {
      LocalStorage.remove('token')
      LocalStorage.remove('expirationDate')
      authStore.setToken('')
    }, expirationDate - Date.now())
  } catch (error) {
    Loading.hide()
    console.log(error)
  }
})
