type AnyFunction = (...args: any[]) => any
type Timer = ReturnType<typeof setTimeout>

const debounceTimers = new WeakMap<AnyFunction, Timer>()

/**
 * 函数防抖：在指定的时间内，多次触发同一个事件，只执行最后一次
 *
 * @param func - 目标函数
 * @param wait - 延迟执行毫秒数，默认 500ms
 * @param immediate - 是否立即执行，默认 false。如果为 true，则在延迟开始时触发，而不是结束时触发
 * @param args - 传递给目标函数的参数
 * @example
 * ```ts
 * const handleInput = debounce((val) => console.log(val), 300)
 * handleInput('a') // 300ms 后打印 'a'
 * ```
 */
export function debounce<T extends AnyFunction>(func: T, wait: number = 500, immediate: boolean = false, ...args: Parameters<T>): void {
  if (typeof func !== 'function')
    return

  const timer = debounceTimers.get(func)
  if (timer)
    clearTimeout(timer)

  if (immediate && !timer)
    func(...args)

  const nextTimer = setTimeout(() => {
    debounceTimers.delete(func)
    if (!immediate)
      func(...args)
  }, wait)

  debounceTimers.set(func, nextTimer)
}

const throttleStates = new WeakMap<AnyFunction, { timer: Timer | null, pendingArgs?: unknown[] }>()

/**
 * 函数节流：限制一个函数在一定时间内只能执行一次
 *
 * @param func - 目标函数
 * @param wait - 延迟执行毫秒数，默认 500ms
 * @param immediate - 是否立即执行，默认 true。如果为 true，则在节流开始前触发；逻辑上略不同于防抖的 immediate
 * @param args - 传递给目标函数的参数
 * @example
 * ```ts
 * const handleScroll = throttling(() => console.log('scroll'), 100)
 * window.addEventListener('scroll', handleScroll)
 * ```
 */
export function throttling<T extends AnyFunction>(func: T, wait: number = 500, immediate: boolean = true, ...args: Parameters<T>): void {
  if (typeof func !== 'function')
    return

  const state = throttleStates.get(func) ?? { timer: null, pendingArgs: undefined }

  if (state.timer) {
    if (!immediate)
      state.pendingArgs = args
    throttleStates.set(func, state)
    return
  }

  if (immediate) {
    func(...args)
    state.pendingArgs = undefined
    state.timer = setTimeout(() => {
      state.timer = null
      throttleStates.set(func, state)
    }, wait)
  }
  else {
    state.timer = setTimeout(() => {
      func(...(state.pendingArgs ?? args) as Parameters<T>)
      state.timer = null
      state.pendingArgs = undefined
      throttleStates.set(func, state)
    }, wait)
  }

  throttleStates.set(func, state)
}
