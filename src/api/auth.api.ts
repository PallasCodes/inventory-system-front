import { api } from 'app/src/api'

const BASE_URL = '/auth'

export const AuthService = {
  login({ email, password }: { email: string; password: string }) {
    return api.post(`${BASE_URL}/login`, { email, password })
  },
  checkStatus() {
    return api.post(`${BASE_URL}/check-status`)
  },
}
