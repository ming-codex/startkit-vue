import type { App } from 'vue'
import { Document, Link, Lightning, Tools, Cellphone, Setting } from '@element-plus/icons-vue'

const icons = { Document, Link, Lightning, Tools, Cellphone, Setting }

export default {
  install(app: App) {
    for (const [key, component] of Object.entries(icons)) {
      app.component(key, component)
    }
  },
}
