import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const loadingCount = ref(0)
  const loadingText = ref('')

  const setLoading = (loading: boolean, text = '') => {
    if (loading) {
      loadingCount.value++
      if (loadingCount.value === 1) {
        isLoading.value = true
        loadingText.value = text
      }
    } else {
      loadingCount.value--
      if (loadingCount.value <= 0) {
        loadingCount.value = 0
        isLoading.value = false
        loadingText.value = ''
      }
    }
  }

  const forceHideLoading = () => {
    isLoading.value = false
    loadingCount.value = 0
    loadingText.value = ''
  }

  return {
    isLoading,
    loadingCount,
    loadingText,
    setLoading,
    forceHideLoading,
  }
})
