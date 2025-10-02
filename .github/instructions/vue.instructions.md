---
applyTo: "**/*.vue"
---

## 模板

本项目是 Uniapp 小程序项目，所以节点和 Web 有所不同：

- `<div>` -> `<view>`
- `<span>` -> `<text>`
- `<img>` -> `<image>`

Uniapp 内置组件：

- `<scroll-view>`: https://uniapp.dcloud.net.cn/component/scroll-view.html
- `<swiper>`: https://uniapp.dcloud.net.cn/component/swiper.html
- `<map>`: https://uniapp.dcloud.net.cn/component/map.html

不可以使用的组件：

- Vue Transition `<transition>`

## 最佳实践

- 在声明组件时，尽可能复用 `utils/props.ts`
- 不要硬编码文本，而是[使用国际化](.github/instructions/use-i18n.instructions.md)

### 命名

- 使用 `on<Element><Event>` 命名事件处理函数，例如 `onButtonClick`
