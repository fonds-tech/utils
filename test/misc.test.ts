import { it, vi, expect, describe } from 'vitest'
import { clone, delay, merge, debounce, throttling } from '../src/misc'

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

    expect(merged).toEqual({ a: { x: 1, y: 2 }, arr: [1, 2, 3], keep: 's', extra: true })
    expect(merged).toBe(target)
    expect(source).toEqual({ a: { y: 2 }, arr: [2, 3], keep: 's', extra: true })
    expect(target).toEqual({ a: { x: 1, y: 2 }, arr: [1, 2, 3], keep: 's', extra: true })
  })

  it('should merge multiple sources sequentially', () => {
    const target = { a: { x: 1 }, arr: [0], flag: false }
    const s1 = { a: { y: 2 }, arr: [1, 2], flag: true }
    const s2 = { a: { z: 3 }, arr: [3], extra: 'ok' }

    const merged = merge(target, s1, s2)

    expect(merged).toEqual({
      a: { x: 1, y: 2, z: 3 },
      arr: [0, 1, 2, 3],
      flag: true,
      extra: 'ok',
    })
    expect(merged).toBe(target)
    expect(target.arr).toEqual([0, 1, 2, 3])
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
