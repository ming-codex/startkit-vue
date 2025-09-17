import fs from 'fs'
import path from 'path'

async function extractKeys(dir: string, prefix = ''): Promise<string[]> {
  const keys: string[] = []

  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      keys.push(...(await extractKeys(fullPath, prefix ? `${prefix}.${file}` : file)))
    } else if (file.endsWith('.ts')) {
      const name = file.replace(/\.ts$/, '')
      const keyPrefix = prefix ? `${prefix}.${name}` : name

      try {
        const mod = await import(`file://${fullPath}?t=${Date.now()}`)
        keys.push(...flattenObject(mod.default, keyPrefix))
      } catch (error) {
        console.warn(`无法导入文件 ${fullPath}:`, error)
      }
    }
  }
  return keys
}

function flattenObject(obj: any, prefix: string): string[] {
  if (typeof obj !== 'object' || obj === null) return [prefix]

  return Object.entries(obj).flatMap(([key, value]) => {
    const newKey = `${prefix}.${key}`
    return typeof value === 'object' && value !== null ? [newKey, ...flattenObject(value, newKey)] : [newKey]
  })
}

async function genTypes() {
  const LOCALES_DIR = path.resolve(__dirname, '../src/i18n/lang')
  const OUTPUT_FILE = path.resolve(__dirname, '../src/types/i18n.d.ts')

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })

  const keys = await extractKeys(path.join(LOCALES_DIR, 'zh'))

  const typeDef = `// 自动生成的文件，请勿手动修改
export type MessageKeys = ${keys.map((k) => `'${k}'`).join(' | ')}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t(key: MessageKeys, ...args: any[]): string
    $tc(key: MessageKeys, choice?: number, ...args: any[]): string
    $te(key: MessageKeys, locale?: string): boolean
    $d(value: number | Date, ...args: any[]): string
    $n(value: number, ...args: any[]): string
    $tm(key: MessageKeys): any
    $rt(message: string): string
  }
}

export {}`

  fs.writeFileSync(OUTPUT_FILE, typeDef, 'utf-8')
  console.log(`✅ i18n 类型文件已生成: ${OUTPUT_FILE}`)
}

export default function I18nTypesPlugin() {
  let isDev = false

  return {
    name: 'vite-plugin-i18n-types',
    configResolved(config: any) {
      isDev = config.command === 'serve'
    },
    async buildStart() {
      // 只在开发模式下生成类型文件
      if (isDev) {
        await genTypes()
      }
    },
    handleHotUpdate: (ctx: any) => ctx.file.includes('/i18n/lang/') && genTypes(),
  }
}
