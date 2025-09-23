import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/common'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import 'highlight.js/styles/github.css'

// 注册常用语言
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)

// 单例 MarkdownIt 实例，避免重复创建
let markdownRenderer: MarkdownIt | null = null

function createMarkdownRenderer(): MarkdownIt {
  if (!markdownRenderer) {
    markdownRenderer = new MarkdownIt({
      html: true,
      linkify: true,
      breaks: false,
      typographer: true,
      highlight(code: string, lang: string) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code class="language-${lang}">${hljs.highlight(code, { language: lang, ignoreIllegals: true }).value}</code></pre>`
          } catch {
            // 忽略高亮错误，使用默认渲染
          }
        }
        const escaped: string = markdownRenderer!.utils.escapeHtml(code)
        return `<pre class="hljs"><code${lang ? ` class="language-${lang}"` : ''}>${escaped}</code></pre>`
      },
    })
  }
  return markdownRenderer
}

// 缓存已渲染的 HTML 内容，使用 LRU 策略
const renderCache = new Map<string, string>()
const MAX_CACHE_SIZE = 50

export function useMarkdownRenderer() {
  const renderer = createMarkdownRenderer()

  function renderMarkdown(content: string, slug: string): string {
    // 检查缓存
    if (renderCache.has(slug)) {
      // LRU: 将访问的项移到末尾
      const html = renderCache.get(slug)!
      renderCache.delete(slug)
      renderCache.set(slug, html)
      return html
    }

    // 渲染并缓存
    const html = content ? renderer.render(content) : '<p>Document not found.</p>'
    renderCache.set(slug, html)

    // LRU 缓存清理：当超过最大大小时，删除最旧的项
    if (renderCache.size > MAX_CACHE_SIZE) {
      const firstKey = renderCache.keys().next().value
      if (firstKey) {
        renderCache.delete(firstKey)
      }
    }

    return html
  }

  function clearCache() {
    renderCache.clear()
  }

  return {
    renderMarkdown,
    clearCache,
  }
}
