import { ref } from 'vue'

/**
 * 计数器组合函数
 * @param initialValue 初始值
 * @returns 计数器相关状态和方法
 */
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  /**
   * 增加计数
   * @param step 步长，默认为 1
   */
  function increment(step = 1) {
    count.value += step
  }

  /**
   * 减少计数
   * @param step 步长，默认为 1
   */
  function decrement(step = 1) {
    count.value -= step
  }

  /**
   * 重置计数
   */
  function reset() {
    count.value = initialValue
  }

  return {
    count,
    increment,
    decrement,
    reset,
  }
}
