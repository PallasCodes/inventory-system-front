import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useRouteStore = defineStore('store', () => {
  const pageTitle = ref<string>('')

  return {
    // State
    pageTitle,

    // Computed
    getPageTitle: computed(() => pageTitle.value),

    // Actions
    setPageTitle(title: string) {
      document.title = `Inventario - ${title}`
      pageTitle.value = title
    },
  }
})
