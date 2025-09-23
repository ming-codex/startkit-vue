import { i18n } from '@/i18n'
import { setLangStorage } from '@/i18n/utils'

/**
 * 语言切换 composable
 */
export function useLanguage() {
  /**
   * 切换语言
   * @param lang 目标语言
   */
  const switchLanguage = (lang: string) => {
    // 更新存储和URL
    setLangStorage(lang)
    // 直接更新 i18n 实例
    i18n.global.locale.value = lang as 'zh' | 'en'
  }

  /**
   * 获取当前语言
   */
  const getCurrentLanguage = () => {
    return i18n.global.locale.value
  }

  return {
    switchLanguage,
    getCurrentLanguage,
  }
}
