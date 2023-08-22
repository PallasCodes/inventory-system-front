import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>('')

  return {
    // State
    token,

    // Getters
    isLoggedIn: computed(() => !!token.value),

    // Actions
    setToken(jwt: string) {
      token.value = jwt
    },
  }
})
