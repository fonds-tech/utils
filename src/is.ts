import { isEqual as _isEqual } from 'lodash-es'

/**
 * 检查值是否不为空
 * @param {T} value - 要检查的值
 * @returns {boolean} 如果值不为undefined、null或空字符串，则返回true；否则返回false
 * @template T
 */
export const isDef = <T>(value: T): value is NonNullable<T> => value !== undefined && value !== null && value !== ''

/**
 * 校验是否是十六进制颜色
 * @param {any} value - 要校验的值
 * @returns {boolean} 如果是有效的十六进制颜色，则返回true；否则返回false
 */
export function isHexColor(value: any): boolean {
  return /^#?(?:[a-f0-9]{6}|[a-f0-9]{3})$/i.test(value)
}

/**
 * 校验是否是邮箱
 * @param {any} value - 要校验的值
 * @returns {boolean} 如果是有效的邮箱地址，则返回true；否则返回false
 */
export function isEmail(value: any): boolean {
  return /[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/.test(value)
}

/**
 * 校验两个值是否相同
 * @param {any} value1 - 第一个要比较的值
 * @param {any} value2 - 第二个要比较的值
 * @returns {boolean} 如果两个值相等，则返回true；否则返回false
 */
export function isEqual(value1: any, value2: any): boolean {
  return _isEqual(value1, value2)
}

/**
 * 校验是否是电话号码
 * @param {any} value - 要校验的值
 * @returns {boolean} 如果是有效的中国大陆手机号码，则返回true；否则返回false
 */
export function isPhoneNo(value: any): boolean {
  return /^1[3-9]\d{9}$/.test(value)
}

/**
 * 校验是否是URL格式
 * @param {string} url - 要校验的URL字符串
 * @returns {boolean} 如果是有效的URL格式，则返回true；否则返回false
 */
export function isUrl(url: string): boolean {
  // eslint-disable-next-line regexp/no-misleading-capturing-group, regexp/no-unused-capturing-group, regexp/no-super-linear-backtracking
  const reg = /^((https?|ftp|file):\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*$/
  return reg.test(url)
}

/**
 * 校验链接是否为图片
 * @param {any} value - 要校验的链接
 * @returns {boolean} 如果链接指向的是图片文件，则返回true；否则返回false
 */
export function isImage(value: any): boolean {
  const reg = /\.(?:jpeg|jpg|gif|png|bmp|webp)$/i
  return reg.test(value)
}

/**
 * 校验链接是否为文档
 * @param {any} link - 要校验的链接
 * @returns {boolean} 如果链接指向的是文档文件，则返回true；否则返回false
 */
export function isDocument(link: any): boolean {
  const reg = /\.(?:docx|xlsx|pptx|pdf|txt|html|csv|json|xml)$/i
  return reg.test(link)
}

/**
 * 校验是否是日期格式
 * @param {string | Date} value - 要校验的日期值
 * @returns {boolean} 如果是有效的日期格式，则返回true；否则返回false
 */
export function isDate(value: any): boolean {
  return !/Invalid|NaN/.test(new Date(value).toString())
}

/**
 * 校验是否是整数
 * @param {any} value - 要校验的值
 * @returns {boolean} 如果是整数，则返回true；否则返回false
 */
export function isDigits(value: any): boolean {
  return /^\d+$/.test(value)
}

/**
 * 校验是否是百分比
 * @param {any} value - 要校验的值
 * @returns {boolean} 如果是有效的百分比格式（如"50%"），则返回true；否则返回false
 */
export function isPercentage(value: any): boolean {
  const reg = /^(?:0|[1-9]\d*)%$/
  return reg.test(value)
}

/**
 * 校验是否是数字
 * @param {string | number} value - 要校验的值
 * @returns {boolean} 如果是有效的数字（包括整数、小数和带千分位的数字），则返回true；否则返回false
 */
export function isNumber(value: any): boolean {
  return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)
}

/**
 * 检查给定的值是否为字符串类型
 * @param {any} value - 要检查的值
 * @returns {boolean} 如果值是字符串类型，则返回true；否则返回false
 */
export function isString(value: any): value is string {
  return typeof value === 'string'
}

/**
 * 判断给定的参数是否为函数
 * @param {unknown} value - 需要检查的参数
 * @returns {boolean} 如果参数是函数，则返回true；否则返回false
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function'
}

/**
 * 是否布尔值
 * @param {any} value - 校验内容
 * @returns {boolean} 如果值是布尔类型，则返回true；否则返回false
 */
export function isBoolean(value: any): boolean {
  return typeof value === 'boolean'
}

/**
 * 检查给定值是否为 Promise 对象。
 * @param {unknown} val - 校验内容
 * @returns {boolean} 如果值是Promise对象，则返回true；否则返回false
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * 校验是否是数组
 * @param {any} value - 校验内容
 * @returns {boolean} 如果值是数组，则返回true；否则返回false
 */
export function isArray<T>(value: any): value is Array<T> {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value)
  }
  else {
    return Object.prototype.toString.call(value) === '[object Array]'
  }
}

/**
 * 校验是否是对象
 * @param {unknown} value - 校验内容
 * @returns {boolean} 如果值是对象（不包括null），则返回true；否则返回false
 */
export function isObject(value: unknown): value is Record<any, any> {
  return value !== null && typeof value === 'object'
}

/**
 * 校验是否为空
 * @param {any} value - 校验内容
 * @returns {boolean} 如果值为空（undefined、null、空字符串、false、0、NaN、空数组或空对象），则返回true；否则返回false
 */
export function isEmpty(value: any): boolean {
  switch (typeof value) {
    case 'undefined':
      return true
    case 'string':
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length === 0)
        return true
      break
    case 'boolean':
      if (!value)
        return true
      break
    case 'number':
      if (value === 0 || Number.isNaN(value))
        return true
      break
    case 'object':
      if (value === null || value.length === 0)
        return true

      // eslint-disable-next-line no-unreachable-loop
      for (const _i in value) {
        return false
      }
      return true
  }
  return false
}

/**
 * 校验是否为非空数据
 * @param {any} value - 校验内容
 * @returns {boolean} 如果值不为空，则返回true；否则返回false
 */
export function isNoEmpty(value: any): boolean {
  return !isEmpty(value)
}

/**
 * 校验是否包含某个值
 * @param {any} value - 要检查的内容（通常是字符串或数组）
 * @param {string | number} param - 要查找的值
 * @returns {boolean} 如果value包含param，则返回true；否则返回false
 */
export function isContains(value: any, param: any): boolean {
  return value.includes(param)
}
