import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Language } from 'element-plus/es/locale'

export function useElementConfig() {
  const { locale, messages } = useI18n()

  const elementConfig = computed(() => ({
    locale: messages.value[locale.value].el as any as Language,
    size: 'small' as const,
    zIndex: 3000,
  }))

  return {
    elementConfig,
  }
}
