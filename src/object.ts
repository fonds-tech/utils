import { isPlainObject } from './is'
import { cloneDeep, merge as lodashMerge } from 'lodash-es'

type PlainObject = Record<PropertyKey, any>

// 展开类型，使提示更友好
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

// 深度合并两个类型
type DeepMergeTwo<T, U> = T extends PlainObject
  ? U extends PlainObject
    ? Prettify<
      {
        [K in keyof T | keyof U]: K extends keyof U
          ? K extends keyof T
            ? DeepMergeTwo<T[K], U[K]> // 递归合并
            : U[K] // 只在 U 中存在
          : K extends keyof T
            ? T[K] // 只在 T 中存在
            : never
      }
    >
    : U
  : U

// 递归合并多个对象
type MergeObjects<T, S extends any[]> = S extends [infer H, ...infer R]
  ? MergeObjects<DeepMergeTwo<T, H>, R>
  : T

/**
 * 深度克隆对象
 *
 * @param value - 要克隆的对象
 * @returns 返回克隆后的新对象
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: { c: 2 } }
 * const newObj = clone(obj)
 * console.log(newObj === obj) // false
 * console.log(newObj.b === obj.b) // false
 * ```
 */
export function clone<T>(value: T): T {
  return cloneDeep(value)
}

/**
 * 深度合并两个或多个对象（会直接修改第一个对象 target）
 *
 * @param target - 目标对象（会被直接修改）
 * @param sources - 一个或多个源对象
 * @returns 返回合并后的目标对象 target
 *
 * @example
 * ```ts
 * const target = { a: 1 }
 * const source = { b: 2, c: { d: 3 } }
 * merge(target, source)
 * // target 变为 { a: 1, b: 2, c: { d: 3 } }
 * ```
 */
export function merge<T extends PlainObject = PlainObject, S extends PlainObject[] = PlainObject[]>(
  target: T = {} as T,
  ...sources: S
): MergeObjects<T, S> {
  const output = (target && typeof target === 'object' ? target : {}) as PlainObject

  const validSources = sources.filter(source => isPlainObject(source))

  return lodashMerge(output, ...validSources) as MergeObjects<T, S>
}
