import { ref, computed } from 'vue'

export interface MarkdownDocMeta {
  slug: string
  title: string
  path: string
}

const markdownModules = import.meta.glob(['../markdown/**/*.md', '../*.md', '../../**/*.md'], {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

function extractTitle(md: string): string {
  const lines = md.split(/\r?\n/)
  for (const line of lines) {
    const match = /^\s*#\s+(.+)\s*$/.exec(line)
    if (match) return match[1].trim()
  }
  return 'Untitled'
}

function toSlug(filePath: string): string {
  // 处理不同的路径前缀
  let withoutPrefix = filePath
  if (filePath.startsWith('../markdown/')) {
    withoutPrefix = filePath.replace(/^\.\.\/markdown\//, '')
  } else if (filePath.startsWith('../docs/')) {
    withoutPrefix = filePath.replace(/^\.\.\/docs\//, '')
  } else if (filePath.startsWith('../../')) {
    withoutPrefix = filePath.replace(/^\.\.\/\.\.\//, '')
  } else if (filePath.startsWith('../')) {
    withoutPrefix = filePath.replace(/^\.\.\//, '')
  }

  const withoutExt = withoutPrefix.replace(/\.md$/, '')
  return withoutExt
}

export function useMarkdownIndex() {
  const docs = ref<MarkdownDocMeta[]>([])
  const loading = ref(false)

  console.log(markdownModules, '---markdownModules')

  let bySlugCache: Map<string, MarkdownDocMeta> | null = null
  let lastDocsLength = 0

  const slugToLoader = new Map<string, () => Promise<string>>()

  Object.entries(markdownModules).forEach(([path, loader]) => {
    slugToLoader.set(toSlug(path), loader)
  })

  async function loadDocs() {
    if (docs.value.length > 0 || loading.value) return

    loading.value = true
    try {
      const docPromises = Object.entries(markdownModules).map(async ([path, loader]) => {
        const content = await loader()
        return {
          slug: toSlug(path),
          title: extractTitle(content),
          path,
        } as MarkdownDocMeta
      })

      const loadedDocs = await Promise.all(docPromises)
      docs.value = loadedDocs.sort((a, b) => a.title.localeCompare(b.title, 'zh'))
    } finally {
      loading.value = false
    }
  }

  const bySlug = computed(() => {
    // 如果 docs 长度没有变化且缓存存在，直接返回缓存
    if (bySlugCache && docs.value.length === lastDocsLength) {
      return bySlugCache
    }

    // 重新创建 Map
    const map = new Map<string, MarkdownDocMeta>()
    for (const d of docs.value) map.set(d.slug, d)

    // 更新缓存
    bySlugCache = map
    lastDocsLength = docs.value.length

    return map
  })

  async function getContentBySlug(slug: string): Promise<string | null> {
    const loader = slugToLoader.get(slug)
    if (loader) {
      return await loader()
    }
    return null
  }

  return {
    docs,
    bySlug,
    getContentBySlug,
    loadDocs,
    loading,
  }
}
