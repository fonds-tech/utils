/**
 * 延时指定的时间后执行回调函数
 *
 * @param delay - 延时时间（毫秒）
 * @returns 返回一个 Promise，在指定时间后 resolve
 *
 * @example
 * ```ts
 * await delay(1000) // 延时 1 秒
 * ```
 */
export function delay(delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
