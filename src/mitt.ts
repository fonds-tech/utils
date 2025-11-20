type EventMap = Record<string, unknown[]>
type Handler<Args extends unknown[] = unknown[]> = (...args: Args) => void
type AnyHandler = Handler<unknown[]>
type EventName<M extends EventMap> = Extract<keyof M, string>
type EventNameWithStar<M extends EventMap> = EventName<M> | '*'
type EventArgs<M extends EventMap, K extends EventName<M>> = M[K] extends unknown[] ? M[K] : [M[K]]

const events = new Map<string, AnyHandler[]>()

export class Mitt<Events extends EventMap = Record<string, unknown[]>> {
  private namespace: string | number

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
   * 初始化事件
   * @param list 事件列表
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
   * @param name 事件名称
   * @param handler 事件处理函数
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
   * 监听事件，但仅触发一次，在第一次触发之后移除该监听器
   * @param name 事件名称
   * @param handler 事件处理函数
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
   * @param name 事件名称
   * @param handler 事件处理函数，如果不传，则移除该事件名称的所有处理函数
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
   * 触发事件
   * @param name 事件名称
   * @param args 事件参数
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
   * 清空所有事件
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
