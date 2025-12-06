import { isPlainObject } from './is'
import { cloneDeep, mergeWith } from 'lodash-es'

type AnyFunction = (...args: any[]) => any
type PlainObject = Record<PropertyKey, any>
type Timer = ReturnType<typeof setTimeout>
type MergeObjects<S extends PlainObject[]> = S extends [infer H, ...infer R]
  ? H extends PlainObject
    ? R extends PlainObject[]
      ? H & MergeObjects<R>
      : H
    : PlainObject
  : PlainObject

/**
 * 延时指定的时间后执行回调函数
 * @param delay - 延时时间（毫秒）
 */
export function delay(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

/**
 * 克隆对象
 * @param value 要克隆的对象
 * @returns 克隆后的对象
 */
export function clone<T>(value: T): T {
  return cloneDeep(value)
}

/**
 * 合并两个或多个对象（会直接修改 target）
 * @param target 目标对象（会被修改）
 * @param sources 源对象列表
 * @returns 合并后的 target
 */
export function merge<T extends PlainObject = PlainObject, S extends PlainObject[] = PlainObject[]>(
  target: T = {} as T,
  ...sources: S
): T & MergeObjects<S> {
  const output = (target && typeof target === 'object' ? target : {}) as PlainObject

  const validSources = sources.filter(source => isPlainObject(source))

  return mergeWith(output, ...validSources, (objValue: any, srcValue: any) => {
    if (Array.isArray(objValue) && Array.isArray(srcValue)) {
      return [...objValue, ...srcValue].map(item => clone(item))
    }
  }) as T & MergeObjects<S>
}

/**
 * 函数防抖 短时间内多次触发同一事件，只执行最后一次，或者只执行最开始的一次，中间的不执行
 * @param Function func 目标函数
 * @param Number wait 延迟执行毫秒数
 * @param Booleans immediate true - 立即执行， false - 延迟执行
 */
const debounceTimers = new WeakMap<AnyFunction, Timer>()

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

/**
 * 函数节流 连续触发事件但是在 n 秒中只执行一次函数。即 2n 秒内执行 2 次
 * @param Function func 函数
 * @param Number wait 延迟执行毫秒数
 * @param Number type 1 表时间戳版，2 表定时器版
 */

const throttleStates = new WeakMap<AnyFunction, { timer: Timer | null, pendingArgs?: unknown[] }>()

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
