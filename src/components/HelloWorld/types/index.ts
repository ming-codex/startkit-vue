/**
 * HelloWorld 组件相关类型定义
 */

export interface HelloWorldProps {
  msg: string
}

export type SupportedLanguage = 'zh' | 'en'

export interface LanguageSwitchOptions {
  defaultLang?: SupportedLanguage
  onSwitch?: (lang: SupportedLanguage) => void
}
