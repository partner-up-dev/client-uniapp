# Basics

## Units

Use px units uniformly.

## File Structure

Global style files:

```
styles/
├── presets/
    └── design.ts         # Design tokens UnoCSS preset
```

Design tokens are provided by the `@partner-up-dev/design-uniapp` package and injected via Vite's `css.preprocessorOptions.scss.additionalData`:

- `@partner-up-dev/design-uniapp/styles` - Design token CSS variables and SCSS utility functions
- Mixins (including `pu-font`, `pu-elevation`, `pu-icon`)

Component style files: `compName.scss` in the component folder.

## Component Styling Structure

Each component typically has:

- `<compName>.vue` — main component
- `<compName>.scss` — scoped styles

```vue
<template>
  <view class="comp-name">
    <!-- UniApp tags only -->
  </view>
</template>

<style lang="scss" scoped src="./compName.scss"></style>
```

## UniApp Tag Requirements

**When to use:** Always when writing Vue templates in UniApp projects.

**Why:** UniApp tags are optimized for cross-platform rendering, ensuring compatibility with mini-programs and other targets.

**Only use UniApp tags**, never web tags:

✅ Correct:

- `<view>` (not `<div>`)
- `<text>` (not `<span>` or `<p>`)
- `<image>` (not `<img>`)
- `<button>` (UniApp's built-in button)

❌ Incorrect:

- `<div>`, `<span>`, `<p>`, `<img>`, `<a>`
