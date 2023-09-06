import { Loading, LocalStorage } from 'quasar'
import { api } from 'src/api'
import { useAuthStore } from 'src/stores/auth-store'

// const router = useRouter()

const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password })
  return response
}

export const useLoginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    Loading.show()
    const { status, data } = await loginUser(email, password)
    Loading.hide()

    if (status !== 201) return false

    const { setToken } = useAuthStore()
    setToken(data.token)

    LocalStorage.set('token', data.token)

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

    const response = await api.get('/item')
    console.log(response)
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
