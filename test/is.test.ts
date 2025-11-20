import { it, expect, describe } from 'vitest'
import {
  isDef,
  isUrl,
  isDate,
  isArray,
  isEmail,
  isEmpty,
  isEqual,
  isImage,
  isDigits,
  isNumber,
  isObject,
  isString,
  isBoolean,
  isNoEmpty,
  isPhoneNo,
  isPromise,
  isContains,
  isDocument,
  isFunction,
  isHexColor,
  isPercentage,
  isPlainObject,
} from '../src/is'

describe('is.ts', () => {
  it('should check defined values', () => {
    expect(isDef(0)).toBe(true)
    expect(isDef(false)).toBe(true)
    expect(isDef('')).toBe(false)
    expect(isDef(null)).toBe(false)
  })

  it('should validate colors and emails', () => {
    expect(isHexColor('#fff')).toBe(true)
    expect(isHexColor('123ABC')).toBe(true)
    expect(isHexColor('#abcd')).toBe(false)
    expect(isEmail('user.name+tag@example.co')).toBe(true)
    expect(isEmail('invalid-email')).toBe(false)
  })

  it('should compare values and phone numbers correctly', () => {
    expect(isEqual({ a: 1, b: [2] }, { a: 1, b: [2] })).toBe(true)
    expect(isEqual([1, 2], [1, 3])).toBe(false)
    expect(isPhoneNo('13812345678')).toBe(true)
    expect(isPhoneNo('12812345678')).toBe(false)
  })

  it('should check url and file extensions', () => {
    expect(isUrl('https://example.com/path')).toBe(true)
    expect(isUrl('example.com')).toBe(true)
    expect(isUrl('not a url')).toBe(false)
    expect(isImage('photo.JPG')).toBe(true)
    expect(isImage('document.pdf')).toBe(false)
    expect(isDocument('report.PDF')).toBe(true)
    expect(isDocument('image.png')).toBe(false)
  })

  it('should handle date and number formats', () => {
    expect(isDate('2024-05-20')).toBe(true)
    expect(isDate('invalid date')).toBe(false)
    expect(isDigits('12345')).toBe(true)
    expect(isDigits('12a45')).toBe(false)
    expect(isPercentage('0%')).toBe(true)
    expect(isPercentage('05%')).toBe(false)
    expect(isPercentage('100')).toBe(false)
    expect(isNumber(1234)).toBe(true)
    expect(isNumber('-1,234.56')).toBe(true)
    expect(isNumber('1,23')).toBe(false)
    expect(isNumber('abc')).toBe(false)
  })

  it('should check primitive types', () => {
    expect(isString('foo')).toBe(true)
    expect(isString(123)).toBe(false)
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(123)).toBe(false)
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean('true')).toBe(false)
  })

  it('should detect promises, arrays, and objects', () => {
    const mockPromise = Promise.resolve(1)
    const thenable = { then: () => {}, catch: () => {} }
    expect(isPromise(mockPromise)).toBe(true)
    expect(isPromise(thenable)).toBe(true)
    expect(isPromise({ then: () => {} })).toBe(false)
    expect(isArray([1, 2, 3])).toBe(true)
    expect(isArray('not-array')).toBe(false)
    expect(isObject({ a: 1 })).toBe(true)
    expect(isObject([])).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject('text')).toBe(false)
  })

  it('should check empty values', () => {
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty(false)).toBe(true)
    expect(isEmpty(0)).toBe(true)
    expect(isEmpty(Number.NaN)).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty('value')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isNoEmpty('value')).toBe(true)
    expect(isNoEmpty(0)).toBe(false)
  })

  it('should check containment', () => {
    expect(isContains('hello world', 'world')).toBe(true)
    expect(isContains([1, 2, 3], 2)).toBe(true)
    expect(isContains('abc', 'z')).toBe(false)
    expect(isContains([1, 2, 3], 4)).toBe(false)
  })

  it('should detect plain objects', () => {
    expect(isPlainObject({ a: 1 })).toBe(true)
    expect(isPlainObject(Object.create(null))).toBe(true)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(new (class Foo {})())).toBe(false)
    expect(isPlainObject(null)).toBe(false)
  })
})
