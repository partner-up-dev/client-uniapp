# PUAccordion 组件实现总结

## 实现内容

基于 wot-design-uni 的 wd-collapse 组件，成功迁移实现了 PUAccordion（手风琴/折叠面板）组件。

## 文件结构

```
src/components/common/PUAccordion/
├── PUAccordion.vue          # 主容器组件
├── PUAccordion.ts           # 主容器类型定义
├── PUAccordion.scss         # 主容器样式
├── PUAccordion.md           # 组件文档
├── PUAccordionItem.vue      # 面板项组件
├── PUAccordionItem.ts       # 面板项类型定义
└── PUAccordionItem.scss     # 面板项样式
```

## 主要特性

### 1. 三种模式

- **普通模式**：支持同时展开多个面板
- **手风琴模式**：同时只能展开一个面板（accordion 属性）
- **查看更多模式**：用于长文本的展开/收起（viewmore 属性）

### 2. 核心功能

- ✅ 父子组件通信（provide/inject 模式）
- ✅ 展开/收起动画
- ✅ 禁用状态
- ✅ 自定义标题插槽
- ✅ 展开前钩子（beforeExpand）
- ✅ toggleAll 方法（切换所有面板）
- ✅ 响应式高度计算

### 3. 设计代币迁移

使用项目的设计代币系统替代了原组件的样式变量：

| 原变量 | 迁移后 | 说明 |
|--------|--------|------|
| `$-color-white` | `$pu-color-surface-container-lowest` | 背景色 |
| `$-collapse-body-color` | `$pu-color-on-surface` | 内容文本色 |
| `$-collapse-more-color` | `$pu-color-primary` | 展开按钮颜色 |
| `$-collapse-title-color` | `$pu-color-on-surface` | 标题颜色 |
| `$-collapse-arrow-color` | `$pu-color-on-surface-variant` | 箭头颜色 |
| `$-collapse-disabled-color` | `opacity: $pu-opacity-disabled` | 禁用状态 |
| `$-collapse-side-padding` | `$pu-spacing-med` | 间距 |

### 4. 代码调整

#### 移除的功能

- 移除了 wot-design-uni 的 `useChildren`/`useParent` composables
- 改用原生 Vue 的 `provide`/`inject` 实现父子通信

#### 保留的功能

- 所有核心功能完整保留
- API 接口保持一致
- 动画效果保持一致

#### 样式简化

- 移除了 BEM mixin（`b`、`e`、`when` 等）
- 使用 SCSS 嵌套语法和 `&` 符号代替
- 移除了暗色主题支持（项目暂不需要）

## 使用示例

### 基础用法

```vue
<PUAccordion v-model="activeNames">
  <PUAccordionItem name="1" title="标题1">内容1</PUAccordionItem>
  <PUAccordionItem name="2" title="标题2">内容2</PUAccordionItem>
</PUAccordion>
```

### 手风琴模式

```vue
<PUAccordion v-model="activeName" accordion>
  <PUAccordionItem name="1" title="标题1">内容1</PUAccordionItem>
  <PUAccordionItem name="2" title="标题2">内容2</PUAccordionItem>
</PUAccordion>
```

### 查看更多模式

```vue
<PUAccordion v-model="expanded" viewmore :line-num="3">
  这是一段很长的文本...
</PUAccordion>
```

## 测试页面

创建了测试页面：`src/pages/test/PUAccordion.vue`

包含以下测试场景：

1. 基础用法
2. 手风琴模式
3. 禁用状态
4. 查看更多模式
5. 切换所有面板（toggleAll）

## 技术实现要点

### 1. 父子组件通信

```typescript
// 父组件提供上下文
provide(PUACCORDION_KEY, {
  props,
  toggle,
});

// 子组件注入上下文
const accordion = inject(PUACCORDION_KEY, null);
```

### 2. 动画实现

通过动态计算内容高度，实现平滑的展开/收起动画：

```typescript
const contentStyle = computed(() => {
  const styles: Record<string, string> = {};
  if (inited.value) {
    styles.transition = "height 0.3s ease-in-out";
  }
  if (!expanded.value) {
    styles.height = "0px";
  } else if (height.value) {
    styles.height = `${height.value}px`;
  }
  return objToStyle(styles);
});
```

### 3. 唯一 ID 生成

```typescript
const accordionId = ref<string>(
  `accordion-item-${Math.random().toString(36).slice(2, 11)}`
);
```

## 符合项目规范

✅ 遵循 `component.instructions.md` 的组件结构规范  
✅ 遵循 `style.instructions.md` 的样式编写规范  
✅ 使用 `@/utils/props` 提供的 props 工具函数  
✅ 使用 `BasicComponentOptions` 设置组件选项  
✅ 使用项目的设计代币系统  
✅ TypeScript 类型定义完整  
✅ 提供完整的组件文档

## 注意事项

1. **name 属性必填**：每个 PUAccordionItem 必须设置唯一的 name 属性
2. **modelValue 类型**：
   - 普通模式：`string[]`
   - 手风琴模式：`string`
   - 查看更多模式：`boolean`
3. **图标使用**：使用 UnoCSS 的 `i-mdi-chevron-down` 类名（已在 safelist 中）
4. **动画时长**：展开/收起动画为 0.3s

## 后续优化建议

1. 可以考虑添加 `lazy` 属性，实现面板内容的懒加载
2. 可以添加 `border` 属性，控制是否显示边框
3. 可以添加更多动画效果选项
4. 如果需要支持暗色主题，可以在 SCSS 中添加相应的样式

## 相关资源

- 参考组件：[wot-design-uni wd-collapse](https://github.com/Moonofweisheng/wot-design-uni/tree/master/src/uni_modules/wot-design-uni/components/wd-collapse)
- 设计代币：`src/styles/_token.scss`
- 项目文档：`.github/instructions/`
