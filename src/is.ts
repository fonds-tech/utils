/* eslint-disable node/prefer-global/process */
import { isEqual as _isEqual } from 'lodash-es'

/**
 * 检查值是否已定义且不为空字符串
 *
 * @param value - 要检查的值
 * @returns 如果值不为 undefined、null 或空字符串，则返回 true；否则返回 false
 * @template T
 *
 * @example
 * ```ts
 * isDef(1) // true
 * isDef('') // false
 * isDef(null) // false
 * ```
 */
export const isDef = <T>(value: T): value is NonNullable<T> => value !== undefined && value !== null && value !== ''

/**
 * 校验是否是十六进制颜色
 *
 * @param value - 要校验的值
 * @returns 如果是有效的十六进制颜色，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isHexColor('#fff') // true
 * isHexColor('123ABC') // true
 * isHexColor('#abcd') // false
 * ```
 */
export function isHexColor(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^#?(?:[a-f0-9]{6}|[a-f0-9]{3})$/i.test(value)
}

/**
 * 校验是否是邮箱
 *
 * @param value - 要校验的值
 * @returns 如果是有效的邮箱地址，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isEmail('user@example.com') // true
 * isEmail('invalid-email') // false
 * ```
 */
export function isEmail(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /[\w!#$%&'*+/=?^`{|}~-]+(?:\.[\w!#$%&'*+/=?^`{|}~-]+)*@(?:\w(?:[\w-]*\w)?\.)+\w(?:[\w-]*\w)?/.test(value)
}

/**
 * 校验两个值是否相同
 *
 * @param value1 - 第一个要比较的值
 * @param value2 - 第二个要比较的值
 * @returns 如果两个值相等，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isEqual({ a: 1 }, { a: 1 }) // true
 * isEqual([1, 2], [1, 3]) // false
 * ```
 */
export function isEqual(value1: any, value2: any): boolean {
  return _isEqual(value1, value2)
}

/**
 * 校验是否是电话号码
 *
 * @param value - 要校验的值
 * @returns 如果是有效的中国大陆手机号码，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isPhoneNo('13812345678') // true
 * isPhoneNo('12812345678') // false
 * ```
 */
export function isPhoneNo(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^1[3-9]\d{9}$/.test(value)
}

/**
 * 校验是否是 URL 格式
 *
 * @param url - 要校验的 URL 字符串
 * @returns 如果是有效的 URL 格式（必须包含协议头），则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isUrl('https://example.com') // true
 * isUrl('example.com') // false
 * ```
 */
export function isUrl(url: unknown): boolean {
  if (typeof url !== 'string')
    return false
  const reg = /^(?:https?|ftp|file):\/\/[\da-z][\da-z.-]*\.[a-z]{2}[/\w .-]*$/i
  return reg.test(url)
}

/**
 * 校验是否是 HTTP 链接
 *
 * @param url - 要校验的 URL 字符串
 * @returns 如果是以 http:// 开头的链接，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isHttp('http://example.com') // true
 * isHttp('https://example.com') // false
 * ```
 */
export function isHttp(url: unknown): boolean {
  if (typeof url !== 'string')
    return false
  return /^http:\/\//i.test(url)
}

/**
 * 校验是否是 HTTPS 链接
 *
 * @param url - 要校验的 URL 字符串
 * @returns 如果是以 https:// 开头的链接，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isHttps('https://example.com') // true
 * isHttps('http://example.com') // false
 * ```
 */
export function isHttps(url: unknown): boolean {
  if (typeof url !== 'string')
    return false
  return /^https:\/\//i.test(url)
}

/**
 * 校验是否是 HTTP 或 HTTPS 链接
 *
 * @param url - 要校验的 URL 字符串
 * @returns 如果是以 http:// 或 https:// 开头的链接，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isHttpOrHttps('http://example.com') // true
 * isHttpOrHttps('https://example.com') // true
 * isHttpOrHttps('ftp://example.com') // false
 * ```
 */
export function isHttpOrHttps(url: unknown): boolean {
  if (typeof url !== 'string')
    return false
  return /^https?:\/\//i.test(url)
}

/**
 * 校验链接是否为图片
 *
 * @param value - 要校验的链接或文件名
 * @returns 如果链接/文件名是以常用图片后缀（jpeg, jpg, gif, png, bmp, webp）结尾，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isImage('photo.jpg') // true
 * isImage('doc.pdf') // false
 * ```
 */
export function isImage(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  const reg = /\.(?:jpeg|jpg|gif|png|bmp|webp)$/i
  return reg.test(value)
}

/**
 * 校验链接是否为文档
 *
 * @param link - 要校验的链接或文件名
 * @returns 如果链接/文件名是以常用文档后缀（docx, xlsx, pptx, pdf, txt, html, csv, json, xml）结尾，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isDocument('report.pdf') // true
 * isDocument('image.png') // false
 * ```
 */
export function isDocument(link: unknown): boolean {
  if (typeof link !== 'string')
    return false
  const reg = /\.(?:docx|xlsx|pptx|pdf|txt|html|csv|json|xml)$/i
  return reg.test(link)
}

/**
 * 校验是否是日期格式
 *
 * @param value - 要校验的日期值（支持日期对象、时间戳、日期字符串）
 * @returns 如果能成功转换为有效日期，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isDate('2024-01-01') // true
 * isDate(new Date()) // true
 * isDate('invalid') // false
 * ```
 */
export function isDate(value: any): boolean {
  return !/Invalid|NaN/.test(new Date(value).toString())
}

/**
 * 校验是否是纯数字组成的字符串（整数）
 *
 * @param value - 要校验的值
 * @returns 如果字符串仅包含数字，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isDigits('123') // true
 * isDigits('12.3') // false
 * ```
 */
export function isDigits(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^\d+$/.test(value)
}

/**
 * 校验是否是百分比格式
 *
 * @param value - 要校验的值
 * @returns 如果符合百分比格式（如 "50%"），则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isPercentage('50%') // true
 * isPercentage('100') // false
 * ```
 */
export function isPercentage(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  const reg = /^(?:0|[1-9]\d*)%$/
  return reg.test(value)
}

/**
 * 校验是否是有效的数字
 *
 * @param value - 要校验的值（支持数字类型或数字字符串）
 * @returns 如果是有限数值（数字类型）或符合规范的数字字符串（含千分位支持），则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isNumber(123) // true
 * isNumber('1,234.56') // true
 * isNumber(NaN) // false
 * ```
 */
export function isNumber(value: unknown): boolean {
  if (typeof value === 'number')
    return Number.isFinite(value)
  if (typeof value !== 'string')
    return false
  return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)
}

/**
 * 判断是否为普通对象（不含数组、函数、null）
 *
 * @param value - 要校验的值
 * @returns 如果是普通对象，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isPlainObject({ a: 1 }) // true
 * isPlainObject([]) // false
 * isPlainObject(null) // false
 * ```
 */
export function isPlainObject(value: unknown): value is Record<PropertyKey, any> {
  if (value === null || typeof value !== 'object')
    return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/**
 * 检查给定值是否为字符串类型
 *
 * @param value - 要检查的值
 * @returns 如果是字符串，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isString('hello') // true
 * isString(123) // false
 * ```
 */
export function isString(value: any): value is string {
  return typeof value === 'string'
}

/**
 * 判断给定的值是否为函数
 *
 * @param value - 要检查的值
 * @returns 如果是函数，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isFunction(() => {}) // true
 * isFunction('not-a-fn') // false
 * ```
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function'
}

/**
 * 检查给定值是否为布尔类型
 *
 * @param value - 要检查的值
 * @returns 如果是布尔值，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isBoolean(true) // true
 * isBoolean(0) // false
 * ```
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

/**
 * 检查给定值是否为 Promise 对象
 *
 * @param val - 校验内容
 * @returns 如果值是 Promise 对象或具有 then 和 catch 方法的对象，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isPromise(Promise.resolve()) // true
 * isPromise({ then: () => {}, catch: () => {} }) // true
 * ```
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * 校验是否是数组
 *
 * @param value - 校验内容
 * @returns 如果值是数组，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]) // true
 * isArray('not-array') // false
 * ```
 */
export function isArray<T>(value: any): value is Array<T> {
  return Array.isArray(value)
}

/**
 * 校验是否是对象
 *
 * @param value - 校验内容
 * @returns 如果值是对象且不为 null（包括数组、普通对象等），则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isObject({}) // true
 * isObject([]) // true
 * isObject(null) // false
 * ```
 */
export function isObject(value: unknown): value is Record<any, any> {
  return value !== null && typeof value === 'object'
}

/**
 * 校验值是否为空
 *
 * @param value - 校验内容
 * @returns 如果值为空（undefined、null、空字符串、false、0、NaN、空数组或空对象），则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty('') // true
 * isEmpty(0) // true
 * isEmpty(false) // true
 * ```
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
 *
 * @param value - 校验内容
 * @returns 如果值不为空（见 isEmpty 逻辑），则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isNoEmpty('value') // true
 * isNoEmpty('') // false
 * ```
 */
export function isNoEmpty(value: any): boolean {
  return !isEmpty(value)
}

/**
 * 校验是否包含某个值
 *
 * @param value - 要检查的内容（通常是字符串或数组）
 * @param param - 要查找的值
 * @returns 如果 value 包含 param，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isContains('hello', 'ell') // true
 * isContains([1, 2, 3], 2) // true
 * ```
 */
export function isContains(value: any, param: any): boolean {
  if (value == null)
    return false
  return value.includes(param)
}

// ========================
// 数据格式校验
// ========================

/**
 * 校验是否是中国身份证号码（支持 15 位和 18 位）
 *
 * @param value - 要校验的身份证号码
 * @returns 如果是有效的身份证号码格式，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isIdCard('110101199003074477') // true
 * ```
 */
export function isIdCard(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^(?:\d{15}|\d{17}[\dX])$/i.test(value)
}

/**
 * 校验是否是银行卡号（16-19 位数字）
 *
 * @param value - 要校验的银行卡号
 * @returns 如果是有效的银行卡号格式，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isBankCard('6222026006705351234') // true
 * ```
 */
export function isBankCard(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^\d{16,19}$/.test(value)
}

/**
 * 校验是否是中国邮政编码（6 位数字）
 *
 * @param value - 要校验的邮政编码
 * @returns 如果是有效的邮政编码格式，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isPostalCode('100000') // true
 * isPostalCode('10000') // false
 * ```
 */
export function isPostalCode(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^\d{6}$/.test(value)
}

/**
 * 校验是否是中国车牌号
 *
 * @param value - 要校验的车牌号
 * @returns 如果是有效的车牌号格式，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isCarNumber('粤B12345') // true
 * isCarNumber('粤B1234D') // true (新能源)
 * ```
 */
export function isCarNumber(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(value)
}

/**
 * 校验是否是 IPv4 地址
 *
 * @param value - 要校验的 IP 地址
 * @returns 如果是有效的 IPv4 地址格式，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isIPv4('127.0.0.1') // true
 * isIPv4('256.256.256.256') // false
 * ```
 */
export function isIPv4(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/.test(value)
}

/**
 * 校验是否是 IPv6 地址
 *
 * @param value - 要校验的 IP 地址
 * @returns 如果是有效的 IPv6 地址格式，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334') // true
 * ```
 */
export function isIPv6(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^(?:[a-f0-9]{1,4}:){7}[a-f0-9]{1,4}$/i.test(value)
}

// ========================
// 字符串校验
// ========================

/**
 * 校验是否全为中文
 *
 * @param value - 要校验的字符串
 * @returns 如果全为中文字符，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isChinese('你好') // true
 * isChinese('hi你好') // false
 * ```
 */
export function isChinese(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^[\u4E00-\u9FA5]+$/.test(value)
}

/**
 * 校验是否为字母和数字组合
 *
 * @param value - 要校验的字符串
 * @returns 如果仅包含字母和数字，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isAlphanumeric('abc123') // true
 * isAlphanumeric('abc-123') // false
 * ```
 */
export function isAlphanumeric(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^[a-z0-9]+$/i.test(value)
}

/**
 * 校验是否全为小写字母
 *
 * @param value - 要校验的字符串
 * @returns 如果全为小写字母，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isLowerCase('abc') // true
 * isLowerCase('Abc') // false
 * ```
 */
export function isLowerCase(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^[a-z]+$/.test(value)
}

/**
 * 校验是否全为大写字母
 *
 * @param value - 要校验的字符串
 * @returns 如果全为大写字母，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isUpperCase('ABC') // true
 * isUpperCase('Abc') // false
 * ```
 */
export function isUpperCase(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /^[A-Z]+$/.test(value)
}

/**
 * 校验字符串是否包含 Emoji
 *
 * @param value - 要校验的字符串
 * @returns 如果包含 Emoji 字符，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * hasEmoji('hello 😊') // true
 * hasEmoji('hello') // false
 * ```
 */
export function hasEmoji(value: unknown): boolean {
  if (typeof value !== 'string')
    return false
  return /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(value)
}

// ========================
// 类型判断
// ========================

/**
 * 校验值是否为 null 或 undefined
 *
 * @param value - 要校验的值
 * @returns 如果值为 null 或 undefined，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isNullish(null) // true
 * isNullish(undefined) // true
 * isNullish(0) // false
 * ```
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

/**
 * 校验是否为 Symbol 类型
 *
 * @param value - 要校验的值
 * @returns 如果是 Symbol 类型，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isSymbol(Symbol('foo')) // true
 * ```
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}

/**
 * 校验是否为正则表达式
 *
 * @param value - 要校验的值
 * @returns 如果是 RegExp 对象，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isRegExp(/abc/) // true
 * isRegExp(new RegExp('abc')) // true
 * ```
 */
export function isRegExp(value: unknown): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}

/**
 * 校验是否为 Map 类型
 *
 * @param value - 要校验的值
 * @returns 如果是 Map 对象，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isMap(new Map()) // true
 * ```
 */
export function isMap(value: unknown): value is Map<any, any> {
  return Object.prototype.toString.call(value) === '[object Map]'
}

/**
 * 校验是否为 Set 类型
 *
 * @param value - 要校验的值
 * @returns 如果是 Set 对象，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * isSet(new Set()) // true
 * ```
 */
export function isSet(value: unknown): value is Set<any> {
  return Object.prototype.toString.call(value) === '[object Set]'
}

// ========================
// 运行环境
// ========================

/**
 * 校验是否在浏览器环境中
 *
 * @returns 如果在浏览器环境（存在 window 和 document），则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * if (isBrowser()) {
 *   console.log(window.location.href)
 * }
 * ```
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * 校验是否在 Node.js 环境中
 *
 * @returns 如果在 Node.js 环境（存在 process.versions.node），则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * if (isNode()) {
 *   console.log(process.version)
 * }
 * ```
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && process.versions != null && process.versions.node != null
}

/**
 * 校验是否在移动端设备
 *
 * @returns 如果 UserAgent 包含移动设备标识，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * if (isMobile()) {
 *   console.log('Mobile device')
 * }
 * ```
 */
export function isMobile(): boolean {
  if (!isBrowser())
    return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator?.userAgent ?? '')
}

/**
 * 校验是否在 iOS 设备
 *
 * @returns 如果是 iPad、iPhone 或 iPod，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * if (isIOS()) {
 *   console.log('iOS device')
 * }
 * ```
 */
export function isIOS(): boolean {
  if (!isBrowser())
    return false
  return /iPad|iPhone|iPod/.test(navigator?.userAgent ?? '')
}

/**
 * 校验是否在 Android 设备
 *
 * @returns 如果 UserAgent 包含 Android，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * if (isAndroid()) {
 *   console.log('Android device')
 * }
 * ```
 */
export function isAndroid(): boolean {
  if (!isBrowser())
    return false
  return /Android/i.test(navigator?.userAgent ?? '')
}

/**
 * 校验是否在微信环境中
 *
 * @returns 如果 UserAgent 包含 MicroMessenger，则返回 true；否则返回 false
 *
 * @example
 * ```ts
 * if (isWechat()) {
 *   console.log('WeChat environment')
 * }
 * ```
 */
export function isWechat(): boolean {
  if (!isBrowser())
    return false
  return /MicroMessenger/i.test(navigator?.userAgent ?? '')
}
