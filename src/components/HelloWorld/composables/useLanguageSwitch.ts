import { useLanguage } from '@/composables/useLanguage'
import type { SupportedLanguage, LanguageSwitchOptions } from '../types'

/**
 * 语言切换组合函数
 * @param options 配置选项
 * @returns 语言切换相关方法
 */
export function useLanguageSwitch(options: LanguageSwitchOptions = {}) {
  const { onSwitch } = options
  const { switchLanguage } = useLanguage()

  /**
   * 切换语言
   * @param lang 目标语言
   */
  function switchLang(lang: SupportedLanguage) {
    switchLanguage(lang)
    onSwitch?.(lang)
  }

  return {
    switchLang,
  }
}
