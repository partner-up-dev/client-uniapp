# 编写样式代码的最佳实践详细指导

## 父组件修改子组件样式

常见于子组件的背景色不适用于父组件的情况，父组件需要修改子组件的背景色但分别暴露这些CSS属性到组件属性中会导致组件属性太复杂，建议的做法有：

- `:deep`
- `css变量`

### 基于 CSS 变量

以背景色为例：

```scss
// compName.scss

.comp-name {
  background-color: var(--comp-name-bg-color, #{$pu-color-surface-container})
}
```

当父组件也用 surface-container 为背景色时，子组件就无法被区分，需要将子组件的背景色设置得更深或更浅：

```scss
// parentCompName.scss

.child-comp-name {
  --pu-textarea-bg-color: #{$pu-color-surface-container-highest};
}
```
