import { Loading, LocalStorage, Notify } from 'quasar'
import { api } from 'src/api'
import route from 'src/router'
import { AuthService } from 'src/api/auth.api'
import { useAuthStore } from 'src/stores/auth-store'
import { handleRequest } from 'src/utils/handleRequest'
import { useRoute, useRouter } from 'vue-router'

export const useLoginUser = async (email: string, password: string): Promise<boolean> => {
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

    LocalStorage.set('token', data.token)

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

export const useLogoutUser = () => {
  const router = useRouter()
  router.replace({ name: 'login' })

  LocalStorage.remove('token')
  api.defaults.headers.common['Authorization'] = ''

  const { setToken } = useAuthStore()
  setToken('')
}
