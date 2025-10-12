---
applyTo: "**/business/**"
---

本指南指导如何实现、维护业务逻辑模块。

## 文件结构

- `src/business`
  - `api.ts`: APIClient base class
  - `index.ts`: ValibotClass
  - `base/`: 基础模块
  - `account/`: 账户模块业务逻辑
  - `partner_request/`: 搭子请求模块业务逻辑
  - `communication/`: 沟通模块业务逻辑

## 使用 Valibot

- 导入: `import * as v from "valibot";`
- 文档: https://valibot.dev/llms.txt

## 最佳实践

## 定义数据模型类

- 使用 `V.class` 继承定义数据模型类，传入 Valibot schema。
- 使用 `nullable` 设置该字段可以为 `null` 且默认值为 `null`
- schema 中定义字段类型，使用 `instance(OtherClass)` 表示关联对象。
- 添加类型别名如 `<XXX>Ref` 表示主键类型。
- 添加 `<XXX>V` 表示 Valibot 模式。
- 添加 `<XXX>Prop` 表示用于定义 Vue 组件属性时，type 字段的值
- 通过变量保存复杂的验证器

```typescript
export type LocationRef = string;

export class Location extends V.class(v.object({
  address: v.array(v.string()),
  friendly_address: v.string(),
  lat: v.number(),
  lng: v.number(),
  _id: v.optional(v.string()),
})) {
  // 类实现
}
```

- 对于日期事件类型的字段，使用 `base/index.ts` 的 `DatetimeV` 模式

### 集成 API 客户端

- 在类中定义静态 `api` 属性，使用 `APIClient` 实例化，指定模块前缀和翻译。
- 实现静态方法调用 `api.requestHTTP` 进行 HTTP 请求。

```typescript
static api = new APIClient<typeof Location>({
  modulePrefix: '/base/location',
  dt: useTranslate('base.location').dt,
  fallbackSchema: Location,
});

static async get(id: LocationRef): Promise<Location> {
  return this.api.requestHTTP({
    method: "GET",
    endpoint: `/${id}`,
  }).then(({ body }) => body.parsed);
}
```

### 实现业务逻辑方法

- 实例方法处理对象级业务逻辑，如 `put`, `post`, `get` 等 。

```typescript
put() {
  this.api.requestHTTP({
    method: "PUT",
    endpoint: '',
    data: { /* 数据 */ },
  }).then(({ body }) => {
    this._id = body.parsed._id;
  });
}
```

### 提供组合式函数 (Composables)

- 定义 `useXXX` 静态方法，返回响应式数据和状态。
- 使用 `ref`, `computed`, `watch` 等 Vue API 处理异步加载和缓存。
- 集成 store 进行数据缓存和状态管理。（仅指定时）

```typescript
static use(route: Route) {
  const _route = ref<Route>(route);
  const _locations = ref<(ComputedRef<Location | undefined>)[]>();

  const locations = computed((): Location[] | undefined => {
    // 计算逻辑
  });

  watch(_route, (newRoute) => {
    // 监听变化
  }, { immediate: true });

  return { locations, _route };
}
```

### 集成状态管理和缓存

- 使用 Pinia store 缓存数据，避免重复 API 调用。（仅指定时，不要滥用缓存）
- 在获取数据时先检查缓存，缓存命中则直接返回。

```typescript
static async get(id: LocationRef): Promise<Location> {
  const cachedLocation = this.locationStore.fetchById(id);
  if (cachedLocation) {
    return cachedLocation;
  }
  // API 调用并缓存
}
```

### 处理异步和错误

- 使用 Promise 处理异步操作。
- 集成错误报告和日志记录。
- 在 composables 中使用 `loading` 状态管理加载过程。

```typescript
const loading = ref(false);
// 在异步操作中设置 loading
```
