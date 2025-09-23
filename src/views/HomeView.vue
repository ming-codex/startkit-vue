<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLanguage } from '@/composables/useLanguage'
const { switchLanguage } = useLanguage()

const router = useRouter()
const { t, locale } = useI18n()

// 响应式数据
const isLoaded = ref(false)
const currentTime = ref('')
const animationEnabled = ref(false)

// 获取当前时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString(locale.value === 'zh' ? 'zh-CN' : 'en-US')
}

// 组件挂载后执行
onMounted(() => {
  updateTime()
  const timeInterval = setInterval(updateTime, 1000)

  // 延迟启用动画，提升首屏性能
  setTimeout(() => {
    isLoaded.value = true
    // 用户交互后再启用复杂动画
    const enableAnimations = () => {
      animationEnabled.value = true
      document.removeEventListener('mousemove', enableAnimations)
      document.removeEventListener('click', enableAnimations)
    }
    document.addEventListener('mousemove', enableAnimations, { once: true })
    document.addEventListener('click', enableAnimations, { once: true })
  }, 100)

  // 清理定时器
  onUnmounted(() => {
    clearInterval(timeInterval)
  })
})

// 查看文档
const viewDocs = () => {
  router.push({ name: 'doc-detail', params: { slug: 'README' } })
}

// 跳转到GitHub
const goToGitHub = () => {
  window.open('https://github.com/ming-codex', '_blank')
}

// 切换语言
const toggleLanguage = () => {
  switchLanguage(locale.value === 'zh' ? 'en' : 'zh')
}

// 功能卡片数据
const featuresZh = [
  {
    icon: 'Lightning',
    title: '高性能',
    description: '基于Vue 3和Vite构建，提供极致的开发体验和运行性能',
  },
  {
    icon: 'Tools',
    title: '现代化',
    description: '使用TypeScript和最新的前端技术栈，确保代码质量和可维护性',
  },
  {
    icon: 'Cellphone',
    title: '响应式',
    description: '完美适配各种设备尺寸，提供一致的用户体验',
  },
  {
    icon: 'Setting',
    title: '可配置',
    description: '灵活的配置选项和插件系统，满足不同项目需求',
  },
]

const featuresEn = [
  {
    icon: 'Lightning',
    title: 'High Performance',
    description: 'Built with Vue 3 and Vite for ultimate development experience and runtime performance',
  },
  {
    icon: 'Tools',
    title: 'Modern',
    description: 'Uses TypeScript and latest frontend tech stack for code quality and maintainability',
  },
  {
    icon: 'Cellphone',
    title: 'Responsive',
    description: 'Perfect adaptation to various device sizes with consistent user experience',
  },
  {
    icon: 'Setting',
    title: 'Configurable',
    description: 'Flexible configuration options and plugin system to meet different project needs',
  },
]
</script>

<template>
  <div class="welcome-container">
    <!-- 简化的背景装饰 -->
    <div class="background-decoration" :class="{ 'animations-enabled': animationEnabled }">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- 主要内容 -->
    <div class="welcome-content" :class="{ loaded: isLoaded }">
      <!-- 头部区域 -->
      <header class="welcome-header">
        <div class="logo-section">
          <div class="logo-icon">
            <svg viewBox="0 0 100 100" class="logo-svg">
              <circle cx="50" cy="50" r="45" fill="url(#gradient1)" />
              <path d="M30 50 L45 35 L70 35 L55 50 L70 65 L45 65 Z" fill="white" />
            </svg>
          </div>
          <h1 class="welcome-title">{{ t('common.hello') }}</h1>
        </div>

        <div class="language-switcher">
          <el-button :type="locale === 'zh' ? 'primary' : 'default'" @click="toggleLanguage" class="lang-btn">
            {{ locale === 'zh' ? 'English' : '中文' }}
          </el-button>
        </div>
      </header>

      <!-- 欢迎信息 -->
      <section class="welcome-section">
        <h2 class="welcome-subtitle">{{ t('common.welcome') }}</h2>
        <p class="welcome-description">
          {{
            locale === 'zh'
              ? '欢迎使用我们的现代化Vue 3应用程序！这是一个功能完整的前端开发模板，集成了最新的技术栈。'
              : 'Welcome to our modern Vue 3 application! This is a complete frontend development template with the latest technology stack.'
          }}
        </p>

        <!-- 当前时间显示 -->
        <div class="time-display">
          <el-icon class="time-icon"><Clock /></el-icon>
          <span class="time-text">{{ currentTime }}</span>
        </div>
      </section>

      <!-- 功能卡片 -->
      <section class="features-section">
        <div class="feature-cards">
          <div class="feature-card" v-for="(feature, index) in locale === 'zh' ? featuresZh : featuresEn" :key="index">
            <div class="feature-icon">
              <el-icon :size="32">
                <component :is="feature.icon" />
              </el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- 操作按钮 -->
      <section class="actions-section">
        <el-button size="large" class="action-btn secondary" @click="viewDocs">
          <el-icon><Document /></el-icon>
          {{ locale === 'zh' ? '查看文档' : 'View Docs' }}
        </el-button>

        <el-button size="large" class="action-btn github-btn" @click="goToGitHub">
          <el-icon><Link /></el-icon>
          GitHub
        </el-button>
      </section>

      <!-- 技术栈展示 -->
      <section class="tech-stack">
        <h3 class="tech-title">{{ locale === 'zh' ? '技术栈' : 'Tech Stack' }}</h3>
        <div class="tech-badges">
          <el-tag type="success" size="large">Vue 3</el-tag>
          <el-tag type="info" size="large">TypeScript</el-tag>
          <el-tag type="warning" size="large">Element Plus</el-tag>
          <el-tag type="danger" size="large">Pinia</el-tag>
          <el-tag size="large">Vite</el-tag>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
    linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.8;
  will-change: transform;
}

/* 默认状态：静态 */
.gradient-orb {
  animation: none;
}

/* 启用动画状态 */
.background-decoration.animations-enabled .gradient-orb {
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  top: -10%;
  left: -10%;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #ec4899, #f472b6);
  top: 50%;
  right: -15%;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(45deg, #22c55e, #10b981);
  bottom: -10%;
  left: 50%;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-30px) rotate(90deg) scale(1.05);
  }
  50% {
    transform: translateY(-20px) rotate(180deg) scale(1.1);
  }
  75% {
    transform: translateY(-40px) rotate(270deg) scale(1.05);
  }
  100% {
    transform: translateY(0px) rotate(360deg) scale(1);
  }
}

.welcome-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  width: 95%;
  max-height: 90vh;
  background: rgba(15, 15, 35, 0.7);
  backdrop-filter: blur(30px);
  border-radius: 32px;
  padding: 4rem;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.welcome-content.loaded {
  opacity: 1;
  transform: translateY(0);
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 60px;
  height: 60px;
}

.logo-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

#gradient1 {
  stop-color: #667eea;
  stop-opacity: 1;
}

#gradient1 stop:last-child {
  stop-color: #764ba2;
  stop-opacity: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-subtitle {
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.time-display {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(99, 102, 241, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

.time-icon {
  color: white;
  font-size: 1.2rem;
}

.time-text {
  color: white;
  font-weight: 500;
  font-size: 1rem;
}

.features-section {
  margin-bottom: 3rem;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-icon {
  color: white;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.75rem;
}

.feature-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  font-size: 0.95rem;
}

.actions-section {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.action-btn {
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
}

.action-btn.github-btn {
  background: linear-gradient(135deg, #24292e, #1a1e22);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  margin-left: 0;
}

.action-btn.github-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.action-btn.github-btn:hover::before {
  left: 100%;
}

.action-btn.github-btn:hover {
  background: linear-gradient(135deg, #2d3339, #21262d);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(36, 41, 46, 0.3);
  transform: translateY(-2px);
}

.tech-stack {
  text-align: center;
}

.tech-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tech-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.tech-badges .el-tag {
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.tech-badges .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-container {
    padding: 0;
  }

  .welcome-content {
    padding: 2rem;
    width: 98%;
    max-height: 95vh;
    border-radius: 20px;
  }

  .welcome-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1.5rem;
  }

  .feature-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .actions-section {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 300px;
  }

  .tech-badges {
    gap: 0.5rem;
  }

  .gradient-orb {
    filter: blur(60px);
  }

  .orb-1,
  .orb-2,
  .orb-3 {
    width: 200px;
    height: 200px;
  }
}

@media (max-width: 480px) {
  .welcome-content {
    padding: 1.5rem;
    width: 98%;
    max-height: 98vh;
    border-radius: 16px;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .welcome-subtitle {
    font-size: 1.25rem;
  }

  .welcome-description {
    font-size: 1rem;
  }

  .gradient-orb {
    filter: blur(40px);
  }

  .orb-1,
  .orb-2,
  .orb-3 {
    width: 150px;
    height: 150px;
  }
}
</style>
