# NavBar 导航栏

## Rationale

提供统一的页面导航栏，包括返回按钮、标题和操作按钮。

## Goals

- 显示页面标题
- 提供返回导航
- 支持刷新和更多操作按钮

## Specification

导航栏包含返回按钮、标题文本、刷新按钮和更多按钮。标题可滚动，支持安全区域适配。

## Implementation

### Props

- `title` (`string`, `""`)：导航栏标题
- `showRefresh` (`boolean`, `true`)：是否显示刷新按钮
- `showMore` (`boolean`, `true`)：是否显示更多按钮

### Events

- `refresh()`: 刷新按钮点击事件
- `more()`: 更多按钮点击事件
