const LANG_KEY = 'app_lang'

// 获取语言
export function getLang(): string {
  const params = new URLSearchParams(window.location.search)
  const urlLang = params.get('lang')
  if (urlLang) {
    localStorage.setItem(LANG_KEY, urlLang)
    return urlLang
  }

  const savedLang = localStorage.getItem(LANG_KEY)
  if (savedLang) {
    return savedLang
  }
  return 'zh'
}

// 设置语言到存储和URL
export function setLangStorage(lang: string) {
  localStorage.setItem(LANG_KEY, lang)

  const params = new URLSearchParams(window.location.search)
  params.set('lang', lang)
  window.history.replaceState({}, '', `?${params.toString()}`)
}

// 加载语言包
export function loadLocale(mods: Record<string, any>, lang: 'zh' | 'en') {
  const result: Record<string, any> = {}
  Object.entries(mods).forEach(([key, mod]) => {
    if (key.startsWith(`./lang/${lang}/`)) {
      const cleanKey = key
        .replace(/^\.\/lang\/(zh|en)\//, '')
        .replace(/\.ts$/, '')
        .replace(/\//g, '.')
      result[cleanKey] = (mod as any).default
    }
  })
  return result
}
