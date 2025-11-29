# Utils

通用工具函数库，提供跨项目可复用的工具方法。

## 📁 目录结构

```
utils/
├── index.ts              # 导出所有工具函数
├── enum.ts              # 枚举相关工具
├── format.ts            # 格式化工具
├── function.ts          # 函数式编程工具（防抖、节流等）
├── log.ts               # 日志管理工具
├── mime.ts              # MIME 类型处理
├── object.ts            # 对象操作工具
├── props.ts             # Vue Props 定义工具
├── retry.ts             # 重试机制工具
├── string.ts            # 字符串处理工具
├── style.ts             # 样式相关工具
├── tabbar.ts            # TabBar 管理工具
├── time.ts              # 时间日期处理工具
├── vendor.ts            # uni-app API 封装
├── vue.ts               # Vue 组件配置工具
└── lbs/                 # 位置服务相关工具
    ├── index.js
    ├── types.ts
    └── qqmap-wx-jssdk.js
```

## 📚 模块说明

### enum.ts - 枚举工具

枚举相关的工具函数。

**主要函数：**

- `enumToPickerOptions(enumObj, label_t?)` - 将枚举对象转换为选择器选项
- `isInEnum(value, enumObj)` - 判断值是否在枚举中

**示例：**

```typescript
import { enumToPickerOptions, isInEnum } from '@/utils'

enum Status {
  Active = 'active',
  Inactive = 'inactive'
}

const options = enumToPickerOptions(Status)
const isValid = isInEnum('active', Status) // true
```

### format.ts - 格式化工具

提供数据格式化功能。

**主要函数：**

- `formatRange(range, connector?, space?)` - 格式化范围值

**示例：**

```typescript
import { formatRange } from '@/utils'

formatRange([1, 10], '~', true) // "1 ~ 10"
```

### function.ts - 函数工具

常用的函数式编程工具。

**主要函数：**

- `debounce(func, wait)` - 防抖函数
- `throttle(func, wait)` - 节流函数
- `isFunction(value)` - 判断是否为函数

**示例：**

```typescript
import { debounce, throttle } from '@/utils'

const debouncedSearch = debounce((keyword: string) => {
  console.log('Search:', keyword)
}, 300)

const throttledScroll = throttle(() => {
  console.log('Scrolling')
}, 100)
```

### log.ts - 日志工具

集成微信实时日志和本地日志管理。

**主要方法：**

- `debug(...args)` - 调试日志（仅控制台）
- `info(...args)` - 信息日志
- `warn(...args)` - 警告日志
- `error(...args)` - 错误日志
- `setFilterMsg(msg)` - 设置过滤关键字
- `addFilterMsg(msg)` - 添加过滤关键字
- `reportEvent(monitor_id, data)` - 上报事件

**示例：**

```typescript
import log from '@/utils/log'

log.info('User logged in', { userId: 123 })
log.error('API request failed', error)
```

### mime.ts - MIME 类型工具

处理文件 MIME 类型。

**主要函数：**

- `getMIMETypeFromFilename(filename)` - 根据文件名获取 MIME 类型

**示例：**

```typescript
import { getMIMETypeFromFilename } from '@/utils'

const mimeType = getMIMETypeFromFilename('image.png') // "image/png"
```

### object.ts - 对象工具

对象操作相关的工具函数。

**主要函数：**

- `deepcopy(obj)` - 深拷贝对象
- `getPropByPath(obj, path)` - 通过路径获取对象属性
- `getType(target)` - 获取变量类型
- `nullToUndef(val)` - 将 null 转换为 undefined
- `undefToNull(val)` - 将 undefined 转换为 null
- `withFallback(val, valid_func, fallback)` - 带默认值的安全访问
- `objFilterToArray(obj)` - 将过滤对象转换为数组
- `objNullToUndef(val)` - 对象中的 null 转为 undefined

**示例：**

```typescript
import { deepcopy, getPropByPath, withFallback } from '@/utils'

const original = { a: { b: 1 } }
const copied = deepcopy(original)

const value = getPropByPath(original, 'a.b') // 1

const result = withFallback(
  maybeUndefined,
  (val) => val.toUpperCase(),
  'default'
)
```

### props.ts - Props 工具

Vue 组件 Props 定义的辅助工具。

**主要导出：**

- `unknownProp` - 未知类型 Prop
- `numericProp` - 数字/字符串 Prop
- `truthProp` - 默认为 true 的布尔 Prop
- `makeRequiredProp(type)` - 创建必填 Prop
- `makeArrayProp(defaultVal?)` - 创建数组 Prop
- `makeBooleanProp(defaultVal)` - 创建布尔 Prop
- `makeNumberProp(defaultVal)` - 创建数字 Prop
- `makeNumericProp(defaultVal)` - 创建数字/字符串 Prop
- `makeStringProp(defaultVal)` - 创建字符串 Prop
- `baseProps` - 基础 Props（customStyle, customClass）

**示例：**

```typescript
import { makeStringProp, makeNumberProp, baseProps } from '@/utils/props'

const props = {
  ...baseProps,
  title: makeStringProp(''),
  count: makeNumberProp(0)
}
```

### retry.ts - 重试工具

提供重试机制支持。

**主要函数：**

- `do_retry(to_retry, parameters)` - 执行重试逻辑

**示例：**

```typescript
import { do_retry } from '@/utils'

do_retry(fetchData, {
  retried: 0,
  max_retries: 3,
  delay: 1
})
```

### string.ts - 字符串工具

字符串处理和转换工具。

**主要函数：**

- `kebabCase(word)` - 转换为 kebab-case
- `snakeCase(word)` - 转换为 snake_case
- `objToQuery(obj, with_prefix?)` - 对象转查询字符串

**示例：**

```typescript
import { kebabCase, snakeCase, objToQuery } from '@/utils'

kebabCase('userName') // "user-name"
snakeCase('userName') // "user_name"
objToQuery({ page: 1, size: 10 }) // "page=1&size=10"
```

### style.ts - 样式工具

样式相关的工具函数和类型定义。

**主要函数：**

- `makeNumberPX(value)` - 将数字转换为像素字符串

**类型定义：**

- `Size` - 尺寸类型："xSmall" | "small" | "medium" | "large" | "xLarge"
- `Radius` - 圆角类型："none" | "xs" | "sm" | "med" | "lg" | "full"

**示例：**

```typescript
import { makeNumberPX, type Size } from '@/utils/style'

const width = makeNumberPX(100) // "100px"
const size: Size = 'medium'
```

### tabbar.ts - TabBar 工具

管理自定义 TabBar 的工具函数。

**主要函数：**

- `syncTabBarIndex(pageId)` - 同步 TabBar 索引
- `setTabBarIndex(index)` - 设置 TabBar 索引
- `hideTabBar()` - 隐藏 TabBar
- `showTabBar()` - 显示 TabBar
- `updateTabBarAvatar(new_url?)` - 更新 TabBar 头像

**示例：**

```typescript
import { syncTabBarIndex, hideTabBar } from '@/utils/tabbar'
import { TABBAR_PAGE_ID } from '@/data/enum'

syncTabBarIndex(TABBAR_PAGE_ID.HOME)
hideTabBar()
```

### time.ts - 时间工具

时间日期处理工具，基于 dayjs。

**主要函数：**

- `formateTimestamp(datetime, is_year?, float?, only_time?)` - 格式化时间戳
- `formatDate(options?)` - 格式化日期对象

**示例：**

```typescript
import { formateTimestamp, formatDate } from '@/utils'

const time1 = formateTimestamp(1638345600) // "12月1号 12:00"
const time2 = formatDate({ withYear: true }) // "2025年11月29号 14:30"
```

### vendor.ts - uni-app API 封装

封装 uni-app API，抹平不同平台之间的差异。

**主要函数：**

- `getWindowInfo()` - 获取窗口信息（兼容支付宝小程序）
- `getElementRect(selector, instance)` - 获取元素位置信息
- `getWindowHeight()` - 获取窗口高度
- `getSafeArea()` - 获取安全区域

**示例：**

```typescript
import { getWindowInfo, getElementRect, getSafeArea } from '@/utils/vendor'

const windowInfo = getWindowInfo()
const safeArea = getSafeArea()
const rect = await getElementRect('.header', this)
```

### vue.ts - Vue 工具

Vue 组件相关的配置。

**主要导出：**

- `BasicComponentOptions` - 基础组件配置（虚拟主机、样式隔离）

**示例：**

```typescript
import { BasicComponentOptions } from '@/utils/vue'

export default {
  ...BasicComponentOptions,
  // 其他配置
}
```

### lbs/ - 位置服务工具

处理地图和位置相关的功能，集成腾讯地图 SDK。

**主要类型：**

- `QQMapDirectionMode` - 路线规划模式枚举
- `QQMapDirectionResult` - 路线规划结果类型
- `QQMapDirectionDrivingRoute` - 驾车路线详情

## 🎯 使用指南

### 导入方式

```typescript
// 从 index.ts 导入（推荐）
import { debounce, deepcopy, formatDate } from '@/utils'

// 从具体模块导入
import log from '@/utils/log'
import { makeStringProp } from '@/utils/props'
```

### 最佳实践

1. **优先使用统一导出**：从 `@/utils` 导入，保持导入路径稳定
2. **类型安全**：充分利用 TypeScript 类型定义
3. **按需导入**：仅导入需要的函数，优化打包体积
4. **命名规范**：遵循项目命名约定（camelCase for functions, PascalCase for types）

## 📖 相关文档

- [编码规范](.github/instructions/coding.instructions.md)
- [TypeScript 规范](.github/instructions/typescript.instructions.md)
- [项目 Wiki - Utils 标准](https://git.hadream.ltd/anana/application/uniapp/wikis/Standard/Uniapp/Utils)

## 🔧 维护说明

- 所有工具函数应保持**纯函数**特性（无副作用）
- 新增工具函数需在 `index.ts` 中导出
- 工具函数应包含完整的 TypeScript 类型定义
- 复杂逻辑应添加 JSDoc 注释
- 建议为工具函数编写单元测试
