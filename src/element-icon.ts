import type { App } from 'vue'
import { Document, Link, Lightning, Tools, Cellphone, Setting, Clock } from '@element-plus/icons-vue'

const icons = { Document, Link, Lightning, Tools, Cellphone, Setting, Clock }

export default {
  install(app: App) {
    for (const [key, component] of Object.entries(icons)) {
      app.component(key, component)
    }
  },
}
