import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')

  const router = useRouter()

  return {
    // State
    token,

    // Getters
    isLoggedIn: computed(() => !!token.value),

    // Actions
    setToken(jwt: string) {
      token.value = jwt

      if (jwt === '') router.replace('/login')
    },
  }
})
