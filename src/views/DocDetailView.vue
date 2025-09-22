<template>
  <div class="doc-detail">
    <div class="header">
      <div class="header-content">
        <div class="breadcrumb">
          <RouterLink to="/" class="breadcrumb-link">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path
                fill="currentColor"
                d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06z"
              />
            </svg>
            首页
          </RouterLink>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ docTitle }}</span>
        </div>
        <div class="actions">
          <RouterLink class="btn btn-primary" :to="{ name: 'home', query: route.query }">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path
                fill="currentColor"
                d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06l2.97-2.97H3.75a.75.75 0 0 1 0-1.5h7.44L8.22 4.03a.75.75 0 0 1 0-1.06z"
              />
            </svg>
            Back to Home
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="content">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading document...</p>
        </div>
        <article v-else class="markdown-body" v-html="html"></article>
      </div>
    </div>

    <!-- 回到顶部按钮 -->
    <Transition name="fade">
      <button
        v-show="showBackToTop"
        @click="scrollToTop"
        class="back-to-top"
        :class="{ 'back-to-top--visible': showBackToTop }"
        aria-label="回到顶部"
        title="回到顶部"
      >
        <el-icon class="back-to-top-icon">
          <ArrowUp />
        </el-icon>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMarkdownIndex } from '../composables/useMarkdownIndex'
import { useMarkdownRenderer } from '../composables/useMarkdownRenderer'

const route = useRoute()
const markdownIndex = useMarkdownIndex()
const { renderMarkdown } = useMarkdownRenderer()

const html = ref<string>('')
const loading = ref(false)
const showBackToTop = ref(false)

onMounted(() => {
  if (markdownIndex.docs.value.length === 0) {
    markdownIndex.loadDocs()
  }

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 清理滚动监听
  window.removeEventListener('scroll', handleScroll)
})

// 处理滚动事件
function handleScroll() {
  showBackToTop.value = window.scrollY > 300
}

// 回到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const docTitle = computed(() => {
  const slug = String(route.params.slug || '')
  const doc = markdownIndex.bySlug.value.get(slug)
  return doc?.title || 'Document not found'
})

// 监听路由变化，懒加载内容
watch(
  () => route.params.slug,
  async (slug) => {
    if (!slug) return

    loading.value = true
    try {
      const content = await markdownIndex.getContentBySlug(String(slug))
      html.value = renderMarkdown(content || '', String(slug))
    } catch (error) {
      console.error('Failed to load document:', error)
      html.value = '<p>Failed to load document.</p>'
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.doc-detail {
  background: #ffffff;
  min-height: 100vh;
  color: #24292f;
}

.header {
  background: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  padding: 16px 0;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 8px;
}

.breadcrumb-link {
  color: #656d76;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  background: #d0d7de;
  color: #24292f;
  text-decoration: none;
}

.breadcrumb-separator {
  color: #656d76;
  font-weight: 300;
}

.breadcrumb-current {
  color: #24292f;
  font-weight: 600;
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.btn-primary {
  background: #238636;
  color: #ffffff;
  border-color: #238636;
}

.btn-primary:hover {
  background: #2ea043;
  border-color: #2ea043;
  transform: translateY(-1px);
  text-decoration: none;
  color: #ffffff;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 0px;
}

.content {
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  overflow: hidden;
}

/* GitHub light theme markdown styles */
:deep(.markdown-body) {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0;
  padding: 32px;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji';
  font-size: 16px;
  line-height: 1.5;
  color: #24292f;
  background-color: #ffffff;
  text-align: left;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #24292f;
}

:deep(.markdown-body h1) {
  font-size: 2em;
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
  margin-bottom: 16px;
}

:deep(.markdown-body h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
  margin-bottom: 16px;
}

:deep(.markdown-body h3) {
  font-size: 1.25em;
  margin-bottom: 16px;
}

:deep(.markdown-body h4) {
  font-size: 1em;
  margin-bottom: 16px;
}

:deep(.markdown-body h5) {
  font-size: 0.875em;
  margin-bottom: 16px;
}

:deep(.markdown-body h6) {
  font-size: 0.85em;
  color: #656d76;
  margin-bottom: 16px;
}

:deep(.markdown-body p) {
  margin-top: 0;
  margin-bottom: 16px;
}

:deep(.markdown-body blockquote) {
  padding: 0 1em;
  color: #656d76;
  border-left: 0.25em solid #d0d7de;
  margin: 0 0 16px 0;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

:deep(.markdown-body li) {
  margin-bottom: 0.25em;
}

:deep(.markdown-body li p) {
  margin-bottom: 0.25em;
}

:deep(.markdown-body code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(175, 184, 193, 0.2);
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  color: #24292f;
}

:deep(.markdown-body pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 6px;
  margin: 0 0 16px 0;
  border: 1px solid #d0d7de;
}

:deep(.markdown-body pre code) {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
  color: #24292f;
  font-size: 13px;
}

:deep(.markdown-body .highlight) {
  background-color: #f6f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #d0d7de;
}

:deep(.markdown-body .highlight pre) {
  background-color: transparent;
  border-radius: 0;
  margin: 0;
  padding: 16px;
  border: none;
}

:deep(.markdown-body .highlight pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  color: #24292f;
}

:deep(.markdown-body table) {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
  margin: 0 0 16px 0;
  border: 1px solid #d0d7de;
  border-radius: 6px;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  padding: 6px 13px;
  border: 1px solid #d0d7de;
  text-align: left;
}

:deep(.markdown-body table th) {
  font-weight: 600;
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  color: #24292f;
}

:deep(.markdown-body table tr) {
  background-color: #ffffff;
}

:deep(.markdown-body table tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

:deep(.markdown-body table tr:last-child td) {
  border-bottom: none;
}

:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
  box-sizing: content-box;
  border-radius: 6px;
}

:deep(.markdown-body a) {
  color: #0969da;
  text-decoration: none;
}

:deep(.markdown-body a:hover) {
  text-decoration: underline;
}

:deep(.markdown-body hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #d0d7de;
  border: 0;
  border-radius: 1px;
}

/* Task lists */
:deep(.markdown-body .task-list-item) {
  list-style-type: none;
}

:deep(.markdown-body .task-list-item input[type='checkbox']) {
  margin: 0 0.2em 0.25em -1.6em;
  vertical-align: middle;
}

/* Inline code in headers */
:deep(.markdown-body h1 code),
:deep(.markdown-body h2 code),
:deep(.markdown-body h3 code),
:deep(.markdown-body h4 code),
:deep(.markdown-body h5 code),
:deep(.markdown-body h6 code) {
  font-size: 0.9em;
  background-color: rgba(175, 184, 193, 0.2);
  padding: 0.2em 0.4em;
  border-radius: 6px;
  color: #24292f;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #656d76;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #0969da;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 回到顶部按钮 - GitHub风格 */
.back-to-top {
  position: fixed;
  bottom: 24px;
  right: calc(50% - 640px + 24px); /* 1280px / 2 + 24px margin */
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #24292f;
  transition: all 0.2s ease;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
}

.back-to-top:hover {
  background-color: #f6f8fa;
  border-color: #8c959f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  color: #0969da;
}

.back-to-top:active {
  transform: translateY(0);
  background-color: #e1e4e8;
}

.back-to-top--visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.back-to-top-icon {
  transition: transform 0.2s ease;
  font-size: 16px;
  color: currentColor;
}

.back-to-top:hover .back-to-top-icon {
  transform: translateY(-1px);
}

/* 淡入淡出动画 - GitHub风格 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 24px 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  :deep(.markdown-body) {
    padding: 16px;
    font-size: 14px;
  }

  :deep(.markdown-body table) {
    font-size: 12px;
  }

  :deep(.markdown-body pre) {
    padding: 12px;
    font-size: 12px;
  }

  .back-to-top {
    bottom: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }

  .back-to-top-icon {
    font-size: 14px;
  }
}

/* 中等屏幕适配 */
@media (max-width: 1280px) {
  .back-to-top {
    right: 24px;
  }
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .back-to-top {
    right: 16px;
  }
}
</style>
