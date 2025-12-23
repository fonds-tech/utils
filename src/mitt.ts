type EventMap = Record<string, unknown[]>
type Handler<Args extends unknown[] = unknown[]> = (...args: Args) => void
type AnyHandler = Handler<unknown[]>
type EventName<M extends EventMap> = Extract<keyof M, string>
type EventNameWithStar<M extends EventMap> = EventName<M> | '*'
type EventArgs<M extends EventMap, K extends EventName<M>> = M[K] extends unknown[] ? M[K] : [M[K]]

const events = new Map<string, AnyHandler[]>()

/**
 * Mitt: 一个微型的全局事件发射器/监听器
 *
 * @template Events - 事件名与其对应参数列表的映射类型
 *
 * @example
 * ```ts
 * const emitter = new Mitt<{
 *   'user:login': [user: { name: string }]
 *   'data:update': []
 * }>()
 *
 * emitter.on('user:login', (user) => console.log(user.name))
 * emitter.emit('user:login', { name: 'Alice' })
 * ```
 */
export class Mitt<Events extends EventMap = Record<string, unknown[]>> {
  private namespace: string | number

  /**
   * 创建 Mitt 实例
   * @param name - 命名空间名称，默认为 'global'
   */
  constructor(name: string | number = 'global') {
    this.namespace = name
  }

  /**
   * 生成带命名空间名称
   * @param name 事件名称
   */
  private name(name: string): string {
    if (name === '*') {
      return '*'
    }
    return `${this.namespace}:${name}`
  }

  /**
   * 批量初始化事件监听
   *
   * @param list - 事件名与处理函数映射的对象
   *
   * @example
   * ```ts
   * emitter.init({
   *   'data:update': () => console.log('updated')
   * })
   * ```
   */
  init(list?: Partial<Record<EventName<Events>, Handler<EventArgs<Events, EventName<Events>>>>>): void {
    if (!list)
      return

    for (const key in list) {
      const handler = list[key as EventName<Events>]
      if (handler)
        this.on(key as EventName<Events>, handler as Handler)
    }
  }

  /**
   * 监听事件
   *
   * @param name - 事件名称。传入 '*' 可监听所有事件
   * @param handler - 事件处理函数
   *
   * @example
   * ```ts
   * emitter.on('login', (user) => console.log(user))
   * emitter.on('*', (type, data) => console.log(type, data))
   * ```
   */
  on(name: '*', handler: Handler<[string, ...any[]]>): void
  on<K extends EventName<Events>>(name: K, handler: Handler<EventArgs<Events, K>>): void
  on(
    name: EventNameWithStar<Events>,
    handler: Handler<[string, ...any[]]> | Handler<EventArgs<Events, EventName<Events>>>,
  ): void {
    const key = this.name(name)
    const handlers = events.get(key)
    if (handlers)
      handlers.push(handler as AnyHandler)
    else
      events.set(key, [handler as AnyHandler])
  }

  /**
   * 监听事件，但仅触发一次
   *
   * 在第一次触发之后会自动移除该监听器。
   *
   * @param name - 事件名称
   * @param handler - 事件处理函数
   *
   * @example
   * ```ts
   * emitter.once('init', () => console.log('Initialized'))
   * ```
   */
  once(name: '*', handler: Handler<[string, ...any[]]>): void
  once<K extends EventName<Events>>(name: K, handler: Handler<EventArgs<Events, K>>): void
  once(
    name: EventNameWithStar<Events>,
    handler: Handler<[string, ...any[]]> | Handler<EventArgs<Events, EventName<Events>>>,
  ): void {
    const key = this.name(name)
    const wrappedHandler: AnyHandler = (...args: unknown[]) => {
      handler(...args as [string, ...unknown[]])
      const handlers = events.get(key)
      handlers?.splice(handlers.indexOf(wrappedHandler) >>> 0, 1)
    }
    const handlers = events.get(key)
    if (handlers)
      handlers.push(wrappedHandler)
    else
      events.set(key, [wrappedHandler])
  }

  /**
   * 移除事件监听
   *
   * @param name - 事件名称
   * @param handler - 要移除的处理函数。如果不传，则移除该事件名下的所有监听器
   *
   * @example
   * ```ts
   * const onLogin = () => {}
   * emitter.on('login', onLogin)
   * emitter.off('login', onLogin) // 移除特定监听
   * emitter.off('login') // 移除所有 login 监听
   * ```
   */
  off<K extends EventName<Events>>(name: K, handler?: Handler<EventArgs<Events, K>>): void {
    const key = this.name(name)
    const handlers = events.get(key)
    if (!handlers)
      return

    if (handler) {
      handlers.splice(handlers.indexOf(handler as AnyHandler) >>> 0, 1)
    }
    else {
      events.set(key, [])
    }
  }

  /**
   * 触发指定的事件
   *
   * @param name - 事件名
   * @param args - 传递给处理函数的参数序列
   *
   * @example
   * ```ts
   * emitter.emit('user:login', { name: 'Bob' })
   * ```
   */
  emit<K extends EventName<Events>>(name: K, ...args: EventArgs<Events, K>): void {
    const key = this.name(name)
    const handlers = events.get(key)
    handlers?.slice().forEach((handler) => {
      handler(...args as unknown[])
    })

    const anyHandlers = events.get('*')
    anyHandlers?.slice().forEach((handler) => {
      handler(key, ...args as unknown[])
    })
  }

  /**
   * 清空当前实例命名空间下的所有事件监听
   *
   * @example
   * ```ts
   * emitter.clear()
   * ```
   */
  clear(): void {
    const prefix = `${this.namespace}:`
    for (const key of events.keys()) {
      if (key.startsWith(prefix))
        events.delete(key)
    }
  }
}

export default Mitt
