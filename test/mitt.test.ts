import Mitt from '../src/mitt'
import { it, vi, expect, describe } from 'vitest'

describe('mitt.ts', () => {
  it('should register and emit events with namespace', () => {
    const mitt = new Mitt<{ foo: [number] }>('ns1')
    const handler = vi.fn<(value: number) => void>()

    mitt.on('foo', handler)
    mitt.emit('foo', 1)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(1)
  })

  it('should support once and off', () => {
    const mitt = new Mitt<{ tap: [] }>('ns2')
    const handler = vi.fn()

    mitt.once('tap', handler)
    mitt.emit('tap')
    mitt.emit('tap')
    expect(handler).toHaveBeenCalledTimes(1)

    const handler2 = vi.fn()
    mitt.on('tap', handler2)
    mitt.off('tap', handler2)
    mitt.emit('tap')
    expect(handler2).not.toHaveBeenCalled()
  })

  it('should allow wildcards and init without double namespacing', () => {
    const mitt = new Mitt<{ bar: [string] }>('ns3')
    const anyHandler = vi.fn<(name: string, payload: string) => void>()
    const handler = vi.fn<(payload: string) => void>()

    mitt.on('*', anyHandler)
    mitt.init({ bar: handler })
    mitt.emit('bar', 'payload')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('payload')
    expect(anyHandler).toHaveBeenCalledTimes(1)
    expect(anyHandler).toHaveBeenCalledWith('ns3:bar', 'payload')
  })

  it('should clear only its namespace', () => {
    const m1 = new Mitt<{ a: [] }>('ns4')
    const m2 = new Mitt<{ a: [] }>('ns5')
    const h1 = vi.fn()
    const h2 = vi.fn()

    m1.on('a', h1)
    m2.on('a', h2)

    m1.clear()
    m1.emit('a')
    m2.emit('a')

    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalledTimes(1)
  })

  it('should remove all handlers when off without handler param', () => {
    const mitt = new Mitt<{ ping: [string] }>('ns6')
    const h1 = vi.fn()
    const h2 = vi.fn()

    mitt.on('ping', h1)
    mitt.on('ping', h2)
    mitt.off('ping')

    mitt.emit('ping', 'x')

    expect(h1).not.toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it('should keep once handler args and remove before next emit', () => {
    const mitt = new Mitt<{ ready: [number, string] }>('ns7')
    const handler = vi.fn<(count: number, label: string) => void>()

    mitt.once('ready', handler)
    mitt.emit('ready', 1, 'a')
    mitt.emit('ready', 2, 'b')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(1, 'a')
  })
})
