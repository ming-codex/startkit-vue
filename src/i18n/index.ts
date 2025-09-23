import { createI18n } from 'vue-i18n'

import elZh from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'

import { getLang, loadLocale } from './utils'

const modules = import.meta.glob('./lang/{zh,en}/**/*.ts', { eager: true }) as Record<
  string,
  { default: Record<string, unknown> }
>

const messages = {
  zh: {
    ...loadLocale(modules, 'zh'),
    el: elZh,
  },
  en: {
    ...loadLocale(modules, 'en'),
    el: elEn,
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: getLang(),
  fallbackLocale: 'zh',
  messages,
})
