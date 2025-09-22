import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Language } from 'element-plus/es/locale'
import elZh from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'

export function useElementConfig() {
  const { locale } = useI18n()

  const elementConfig = computed(() => {
    const elLocale = locale.value === 'zh' ? elZh : elEn

    return {
      locale: elLocale as Language,
      size: 'small' as const,
      zIndex: 3000,
    }
  })

  return {
    elementConfig,
  }
}
