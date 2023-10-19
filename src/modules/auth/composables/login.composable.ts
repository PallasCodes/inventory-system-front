import { Loading, LocalStorage } from 'quasar'
import { api } from 'src/api'
import { AuthService } from 'src/api/auth.api'
import { useAuthStore } from 'src/stores/auth-store'
import { handleRequest } from 'src/utils/handleRequest'

export const useLoginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    Loading.show()
    const { data } = await handleRequest(AuthService.login, { email, password })
    Loading.hide()

    const { setToken } = useAuthStore()
    setToken(data.token)

    LocalStorage.set('token', data.token)

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    return true
  } catch (e) {
    Loading.hide()
    console.error(e)
    return false
  }
}

export const useLogoutUser = () => {
  LocalStorage.remove('token')
  api.defaults.headers.common['Authorization'] = ''

  const { setToken } = useAuthStore()
  setToken('')
}
