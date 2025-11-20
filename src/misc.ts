import { isPlainObject } from './is'

/**
 * 延时指定的时间后执行回调函数
 * @param delay - 延时时间（毫秒）
 */
export function delay(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

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

const structuredCloneFn = typeof globalThis.structuredClone === 'function' ? globalThis.structuredClone : null

function cloneWithCache<T>(value: T, cache: WeakMap<object, unknown>): T {
  if (value === null || typeof value !== 'object')
    return value
  if (typeof value === 'function')
    return value

  if (structuredCloneFn) {
    try {
      return structuredCloneFn(value as unknown as object) as T
    }
    catch {
      // 如果 structuredClone 不支持当前值则回退到下方逻辑
    }
  }

  const cached = cache.get(value as object)
  if (cached)
    return cached as T

  if (value instanceof Date) {
    const cloned = new Date(value.getTime()) as T
    cache.set(value, cloned)
    return cloned
  }

  if (value instanceof RegExp) {
    const cloned = new RegExp(value.source, value.flags) as T
    cache.set(value, cloned)
    return cloned
  }

  if (value instanceof Map) {
    const cloned = new Map()
    cache.set(value, cloned)
    value.forEach((v, k) => {
      cloned.set(cloneWithCache(k, cache), cloneWithCache(v, cache))
    })
    return cloned as unknown as T
  }

  if (value instanceof Set) {
    const cloned = new Set()
    cache.set(value, cloned)
    value.forEach(v => cloned.add(cloneWithCache(v, cache)))
    return cloned as unknown as T
  }

  if (Array.isArray(value)) {
    const cloned = value.map(item => cloneWithCache(item, cache)) as unknown as T
    cache.set(value, cloned as unknown as object)
    return cloned
  }

  if (value instanceof ArrayBuffer) {
    const cloned = value.slice(0) as T
    cache.set(value, cloned)
    return cloned
  }

  if (ArrayBuffer.isView(value)) {
    const view = value as ArrayBufferView & { BYTES_PER_ELEMENT?: number, slice?: () => unknown }
    const length = typeof view.BYTES_PER_ELEMENT === 'number' && view.BYTES_PER_ELEMENT > 0
      ? view.byteLength / view.BYTES_PER_ELEMENT
      : view.byteLength

    let cloned: unknown
    if (typeof view.slice === 'function') {
      cloned = view.slice()
    }
    else {
      const ViewCtor = value.constructor as new (buffer: ArrayBufferLike, byteOffset?: number, length?: number) => typeof value
      cloned = new ViewCtor(view.buffer.slice(0), view.byteOffset, length)
    }

    cache.set(value as unknown as object, cloned as unknown as object)
    return cloned as T
  }

  const cloned: PlainObject = Object.create(Object.getPrototypeOf(value))
  cache.set(value as unknown as object, cloned)
  for (const key of Reflect.ownKeys(value)) {
    cloned[key as keyof PlainObject] = cloneWithCache((value as PlainObject)[key as keyof PlainObject], cache)
  }
  return cloned as T
}

/**
 * 克隆对象
 * @param value 要克隆的对象
 * @returns 克隆后的对象
 */
export function clone<T>(value: T): T {
  return cloneWithCache(value, new WeakMap<object, unknown>())
}

/**
 * 合并两个对象
 * @param target 目标对象
 * @param sources 源对象列表
 * @returns 合并后的对象
 */
export function merge<T extends PlainObject = PlainObject, S extends PlainObject[] = PlainObject[]>(
  target: T = {} as T,
  ...sources: S
): T & MergeObjects<S> {
  const output: PlainObject = isPlainObject(target) ? clone(target) : {}

  for (const source of sources) {
    if (!isPlainObject(source))
      continue

    for (const key of Reflect.ownKeys(source)) {
      const incoming = (source as PlainObject)[key as keyof PlainObject]
      const existing = output[key as keyof PlainObject]

      if (Array.isArray(existing) && Array.isArray(incoming)) {
        output[key as keyof PlainObject] = [...existing, ...incoming].map(item => clone(item)) as unknown as PlainObject[keyof PlainObject]
        continue
      }

      if (isPlainObject(existing) && isPlainObject(incoming)) {
        output[key as keyof PlainObject] = merge(existing, incoming) as unknown as PlainObject[keyof PlainObject]
        continue
      }

      output[key as keyof PlainObject] = clone(incoming) as unknown as PlainObject[keyof PlainObject]
    }
  }

  return output as T & MergeObjects<S>
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
