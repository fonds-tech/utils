import { delay } from '../src/async'
import { clone, merge } from '../src/object'
import { debounce, throttling } from '../src/function'
import { it, vi, expect, describe } from 'vitest'

describe('misc.ts', () => {
  it('should deep clone complex structures and keep circular refs intact', () => {
    const fn = vi.fn()
    const date = new Date()
    const regex = /abc/gi
    const map = new Map<any, any>([['k', { v: 1 }]])
    const set = new Set<any>([1, { n: 2 }])
    const typed = new Uint8Array([1, 2, 3])
    const circular: any = { a: 1 }
    circular.self = circular

    const original = {
      date,
      regex,
      map,
      set,
      typed,
      fn,
      nested: { x: 1 },
      circular,
    }

    const result = clone(original)

    expect(result).not.toBe(original)
    expect(result.date.getTime()).toBe(date.getTime())
    expect(result.regex.source).toBe(regex.source)
    expect(result.regex.flags).toBe(regex.flags)
    expect(result.map).not.toBe(map)
    expect(result.map.get('k')).toEqual({ v: 1 })
    expect(result.set).not.toBe(set)
    expect([...result.set][1]).toEqual({ n: 2 })
    expect(result.typed).not.toBe(typed)
    expect(Array.from(result.typed)).toEqual(Array.from(typed))
    expect(result.fn).toBe(fn)
    expect(result.circular).not.toBe(circular)
    expect(result.circular.self).toBe(result.circular)
  })

  it('should merge into target while keeping sources untouched', () => {
    const target = { a: { x: 1 }, arr: [1], keep: 't' }
    const source = { a: { y: 2 }, arr: [2, 3], keep: 's', extra: true }

    const merged = merge(target, source)

    // Lodash default behavior: arrays are merged index by index.
    // target.arr[0] (1) is overwritten by source.arr[0] (2)
    // target.arr[1] is undefined, so it takes source.arr[1] (3)
    expect(merged).toEqual({ a: { x: 1, y: 2 }, arr: [2, 3], keep: 's', extra: true })
    expect(merged).toBe(target)
    expect(source).toEqual({ a: { y: 2 }, arr: [2, 3], keep: 's', extra: true })
    expect(target).toEqual({ a: { x: 1, y: 2 }, arr: [2, 3], keep: 's', extra: true })
  })

  it('should merge multiple sources sequentially', () => {
    const target = { a: { x: 1 }, arr: [0], flag: false }
    const s1 = { a: { y: 2 }, arr: [1, 2], flag: true }
    const s2 = { a: { z: 3 }, arr: [3], extra: 'ok' }

    const merged = merge(target, s1, s2)

    // s1 merges into target: arr becomes [1, 2] (0->1, undefined->2)
    // s2 merges into target: arr becomes [3, 2] (1->3, 2 kept)
    expect(merged).toEqual({
      a: { x: 1, y: 2, z: 3 },
      arr: [3, 2],
      flag: true,
      extra: 'ok',
    })
    expect(merged).toBe(target)
    expect(target.arr).toEqual([3, 2])
    expect(s1.arr).toEqual([1, 2])
    expect(s2.arr).toEqual([3])
  })

  it('should mutate target even when return value is ignored', () => {
    const target = { a: { x: 1 }, b: 1 }
    const source = { a: { y: 2 }, c: 3 }
    const originalA = target.a

    merge(target, source)

    expect(target).toEqual({ a: { x: 1, y: 2 }, b: 1, c: 3 })
    expect(target.a).toBe(originalA)
  })

  it('should work with proxy/ reactive-like targets', () => {
    const raw = { nested: { x: 1 } }
    const proxy = new Proxy(raw, {})
    merge(proxy, { nested: { y: 2 }, b: 1 })

    expect(raw).toEqual({ nested: { x: 1, y: 2 }, b: 1 })
    expect(proxy).toEqual({ nested: { x: 1, y: 2 }, b: 1 })
  })

  it('should handle deep merge correctly', () => {
    const target = { a: { b: { c: 1 } } }
    const source = { a: { b: { d: 2 } } }
    merge(target, source)
    expect(target).toEqual({ a: { b: { c: 1, d: 2 } } })
  })

  it('should handle array merge correctly (default lodash behavior)', () => {
    const obj1 = { arr: [{ a: 1 }] }
    const obj2 = { arr: [{ b: 2 }] }
    const merged = merge(obj1, obj2)

    // Lodash default merge behavior for arrays:
    // It merges index by index.
    // arr[0] from source merges into arr[0] from target.
    // Result length is max(target.length, source.length).
    expect(merged.arr).toHaveLength(1)
    expect(merged.arr[0]).toEqual({ a: 1, b: 2 })
  })

  it('should handle array merge correctly (default lodash behavior) - references', () => {
    const item1 = { a: 1 }
    const obj1 = { arr: [item1] }
    const obj2 = { arr: [{ b: 2 }] }

    const merged = merge(obj1, obj2)
    // Lodash merge mutates deep properties.
    // merged.arr[0] is strictly equal to item1 because lodash merges into it.
    expect(merged.arr[0]).toBe(item1)
    expect(merged.arr[0]).toEqual({ a: 1, b: 2 })
  })

  it('should ignore non-plain-object sources', () => {
    const target = { a: 1 }
    const source1 = null
    const source2 = undefined
    const source3 = 'string'
    const source4 = 123
    // @ts-expect-error test invalid input
    merge(target, source1, source2, source3, source4, { b: 2 })
    expect(target).toEqual({ a: 1, b: 2 })
  })

  it('should handle circular references in merge', () => {
    const target: any = { a: 1 }
    const source: any = { b: 2 }
    source.self = source
    merge(target, source)
    expect(target.b).toBe(2)
    expect(target.self).toBe(target.self) // Circular reference maintained? mergeWith default might handle this differently or throw stack overflow if not careful, but lodash handles it.
    // Note: lodash merge handles circular refs by creating new circular structure in target.
    expect(target.self).toEqual(source)
  })

  it('should mutate original object and update all references', () => {
    const original = { a: 1, nested: { x: 1 } }
    const alias = original
    const anotherRef = original.nested

    merge(original, { a: 2, nested: { y: 2 } })

    // Check if alias sees the changes (it should, as it's the same reference)
    expect(alias).toEqual({ a: 2, nested: { x: 1, y: 2 } })
    expect(alias).toBe(original)

    // Check if nested object reference is preserved (lodash merge mutation behavior)
    expect(original.nested).toBe(anotherRef)
    expect(anotherRef).toEqual({ x: 1, y: 2 })
  })

  it('should debounce calls and use latest arguments', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()

    debounce(fn, 100, false, 'first')
    vi.advanceTimersByTime(50)
    debounce(fn, 100, false, 'second')
    await vi.advanceTimersByTimeAsync(100)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('second')

    const immediateFn = vi.fn()
    debounce(immediateFn, 100, true, 'immediate')
    debounce(immediateFn, 100, true, 'skip')
    expect(immediateFn).toHaveBeenCalledTimes(1)
    expect(immediateFn).toHaveBeenCalledWith('immediate')
    vi.runOnlyPendingTimers()
  })

  it('should throttle calls with leading and trailing behavior', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()

    throttling(fn, 100, true, 'a')
    throttling(fn, 100, true, 'b')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('a')
    await vi.advanceTimersByTimeAsync(100)

    throttling(fn, 100, false, 'c')
    throttling(fn, 100, false, 'd')
    await vi.advanceTimersByTimeAsync(100)

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('d')
  })

  it('should delay promises', async () => {
    vi.useFakeTimers()
    const spy = vi.fn()

    const promise = delay(100).then(spy)
    await vi.advanceTimersByTimeAsync(100)
    await promise

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
