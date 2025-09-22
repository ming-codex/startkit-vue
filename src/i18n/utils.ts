const LANG_KEY = 'app_lang'

// 获取语言
export function getLang(): string {
  const url = new URL(window.location.href)
  let urlLang: string | null = null

  // 优先从 hash 路由中获取语言参数
  if (url.hash) {
    const hashParts = url.hash.split('?')
    if (hashParts[1]) {
      const hashParams = new URLSearchParams(hashParts[1])
      urlLang = hashParams.get('lang')
    }
  }

  // 如果 hash 中没有找到，再从普通查询参数中获取
  if (!urlLang) {
    const params = new URLSearchParams(url.search)
    urlLang = params.get('lang')
  }

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

  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  params.set('lang', lang)

  // 处理 hash 路由模式
  if (url.hash) {
    // 如果存在 hash，将查询参数追加到 hash 后面
    const hashParts = url.hash.split('?')
    const hashPath = hashParts[0]
    const hashParams = hashParts[1] ? new URLSearchParams(hashParts[1]) : new URLSearchParams()
    hashParams.set('lang', lang)
    url.hash = `${hashPath}?${hashParams.toString()}`
  } else {
    // 如果没有 hash，使用普通的查询参数
    url.search = params.toString()
  }

  window.history.replaceState({}, '', url.toString())
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
