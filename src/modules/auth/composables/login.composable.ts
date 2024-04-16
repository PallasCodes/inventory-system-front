import { Cookies, Loading, LocalStorage, Notify } from 'quasar'
import { api } from 'src/api'
import { AuthService } from 'src/api/auth.api'
import { useAuthStore } from 'src/stores/auth-store'
import { handleRequest } from 'src/utils/handleRequest'

export const useLoginUser = async (email: string, password: string): Promise<boolean> => {
  const authStore = useAuthStore()

  try {
    Loading.show()

    const { data, status } = await handleRequest(AuthService.login, { email, password })

    if (status === 401) {
      Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'danger',
        message: 'Credenciales no válidas',
      })
      return false
    }

    if (!data.token) throw new Error()

    Loading.hide()

    const { setToken } = useAuthStore()
    setToken(data.token)

    Cookies.set('user_token', data.token)
    // LocalStorage.set('token', data.token)

    const delay = 120000
    const now = Date.now()
    const expirationDate = now + data.expiresIn - delay

    Cookies.set('expirationDate', expirationDate.toString())
    // LocalStorage.set('expirationDate', expirationDate)

    setTimeout(() => {
      Cookies.remove('user_token')
      Cookies.remove('expirationDate')

      // LocalStorage.remove('token')
      // LocalStorage.remove('expirationDate')
      authStore.setToken('')
    }, data.expiresIn - delay)
    // TODO: add env var

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    return true
  } catch (e) {
    Loading.hide()
    console.error(e)

    Notify.create({
      color: 'red-5',
      textColor: 'white',
      icon: 'danger',
      message: 'Ocurrió un error en el servidor',
    })

    return false
  }
}
