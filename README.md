# @fonds/utils

轻量的 TypeScript 工具集，聚焦常见的类型与格式校验（邮箱、手机号、URL、颜色值、空值等）。按需引入即可在浏览器或 Node.js 环境使用。

## 安装

```bash
pnpm add @fonds/utils
# 或
npm install @fonds/utils
```

## 快速上手

```ts
import { isEmail, isEmpty, isEqual, isPhoneNo } from '@fonds/utils'

isEmail('user@example.com') // true
isPhoneNo('13812345678') // true
isEmpty({}) // true
isEqual({ a: 1 }, { a: 1 }) // true
```

## API 速览

- `isDef(value)`：值不为 `undefined`、`null`、空字符串
- `isHexColor(value)`：3/6 位十六进制颜色
- `isEmail(value)`：邮箱格式
- `isEqual(a, b)`：深度相等
- `isPhoneNo(value)`：中国大陆手机号
- `isUrl(url)`：URL 格式
- `isImage(value)`：图片扩展名
- `isDocument(value)`：常见文档扩展名
- `isDate(value)`：可被 `Date` 解析
- `isDigits(value)`：仅数字字符
- `isPercentage(value)`：形如 `0%`、`12%` 的百分比
- `isNumber(value)`：整数/小数/带千分位的数字
- `isString(value)`：字符串类型
- `isFunction(value)`：函数类型
- `isBoolean(value)`：布尔类型
- `isPromise(value)`：Promise 或类 Promise
- `isArray<T>(value)`：数组
- `isObject(value)`：对象（含数组，排除 `null`）
- `isEmpty(value)`：空值判断（`undefined`、`null`、空串、`false`、`0`、`NaN`、空数组/对象）
- `isNoEmpty(value)`：`!isEmpty`
- `isContains(value, param)`：是否包含指定项/子串

## 开发与脚本

- `pnpm dev`：watch 模式构建
- `pnpm build`：产物输出到 `dist/`（含类型）
- `pnpm test`：使用 Vitest 运行单测
- `pnpm lint` / `pnpm typecheck`：ESLint 与 TypeScript 类型检查

## 许可

MIT
