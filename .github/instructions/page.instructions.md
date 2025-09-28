---
applyTo: "**/pages/**"
---

本指南指导页面的的开发。

## 文件结构

页面代码放在 `pages/` 目录下，按功能模块划分子目录；在 `pages/` 下的页面是 TabBar 页面。

每个页面都有独立的文件夹，其中有如下文件：

```
pageName/
├── pageName.vue        # 页面主文件
├── pageName.scss       # 页面样式
└── pageName.md         # 页面文档
```

页面文档的编写模板参考 [组件文档模板](.github/instructions/component.instructions.md#compnamed-md)。

## 安全区域

使用 `common/safeAreaInset` 组件来处理安全区域，有这些安全区域插入要处理：

- 顶部安全区域插入：即状态栏
- 底部安全区域插入：即 Home Indicator
- 微信小程序菜单按钮插入：在页面的 Header 部分右侧配置
- TabBar 安全区域插入：仅 TabBar 页面

## 生命周期

- onLoad
- onReady: 页面初次渲染完成，此时组件已挂载完成，DOM 树($el)已可用
- onShow: 页面每次出现在屏幕上都触发，包括"返回"
- onHide
- onUnload
- 更多请查阅 [Uniapp - Page Lifecycle](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)

### onLoad

> onLoad 触发时，响应式数据、计算属性、方法、侦听器、props、slots 已设置完成

接收页面参数：

```typescript
// TODO need update, zod is not available, use valibot
import * as v from "valibot";

const propsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((value) => parseInt(value))
  ),
  type: v.variant(["default", "edit"], "default"),
});
const props = ref<v.InferOutput<typeof propsSchema>>();

// note that query's value are all string
onLoad((query) => {
  props.value = v.parse(propsSchema, query);
});
```

### 导航

- 使用 `data/mapper` 的 `PAGE_PATH` 获取页面路径
- 使用 `utils/vendor` 的 `navigate` 函数进行页面导航

## 相关文档

- [Uniapp 教程-页面](https://uniapp.dcloud.net.cn/tutorial/page.html)
