---
applyTo: "**/*.vue, **/composables/*.ts, **/use*.ts"
description: "Vue.js framework idioms and best practices under UniApp. Follow these guidelines when editing the template, script sections or composables"
---

## 1. UniApp & MiniProgram Constraints

### 1.1 Environment Restrictions (No DOM/BOM)

- [Critical] No `window` or `document`
  - The MiniProgram logic layer runs in JSCore, not a browser.
  - Forbidden: `window`, `document`, `navigator`, `localStorage`, `cookie`.
  - Replacement:
    - `window.innerWidth` -> `uni.getWindowInfo().windowWidth`
    - `localStorage` -> `uni.setStorageSync` / `uni.getStorageSync`
    - `alert` -> `uni.showModal` / `uni.showToast`
    - `fetch` -> `uni.request`

## 1.2 Tag & Component Usage

- [Mandatory] Follow the [UniApp Native Component Guide](/docs/.agents/miniprogram-compatibility/native-components.md)

Quick reference:

- `<div>`, `<section>`, `<ul>`, `<li>` -> `<view>`
- `<span>`, `<i>`, `<b>`, `<strong>` -> `<text>` (inline) or `<view>` (block)
- `<img>` -> `<image>`
- `<a>` -> `<navigator :url="...">`
- `<select>` -> `<picker>`

## 2. Lifecycle & Routing

### 2.1 Dual Lifecycle Model

- [Critical] Component vs. Page lifecycle
  - Component hooks: `onMounted`, `onUnmounted` for reusable logic.
  - Page hooks: `onLoad`, `onShow`, `onPullDownRefresh` for page init and data fetching.
  - `onLoad` receives query params; `onMounted` does not.

### 2.2 Routing

- [Forbidden] `vue-router`
  - UniApp uses its own routing based on `pages.json`.
  - Use the `navigate` we wrapped from `src/utils/vendor`.

## 3. Reactivity & Data Flow

### 3.1 Granular State Control

- [Recommended] Use `ref` for primitives and object references.
- [Recommended] Use `shallowRef` for large immutable datasets to reduce bridge cost.
  - Trigger updates by replacing `.value` or use `triggerRef` for internal mutation.

### 3.2 toValue Normalization (Vue 3.3+)

- [Standard] When accepting args that could be a value, a ref, or a getter, use `toValue()` (or `unref` in older versions).

### 3.3 watch Timing & Cleanup

- [Critical] watch defaults to `flush: 'pre'`.
  - If accessing native UI nodes (via `uni.createSelectorQuery`), use `flush: 'post'` or `nextTick`.
- [Mandatory] Use `onCleanup` to cancel stale requests/timers.

## 4. Component Architecture

### 4.1 Component Definition

- [Mandatory] Use Composition API with `<script setup>` syntax.

### 4.2 Computed Properties

- [Mandatory] Use `computed(() => ...)` for derived state.
- [Forbidden] Do not execute side effects inside computed getters.

### 4.3 Dependency Injection (Provide/Inject)

- [Mandatory] Use `Symbol` keys for provide/inject.
- [Pitfall] Provide reactivity (pass the `ref`, not `.value`).
- [Standard] Use `readonly()` for provided state if children should not mutate it.

## 6. Common Pitfalls & Subtle Bugs

### 6.1 Z-Index Trap

- [Pitfall] Native components (`<map>`, `<video>`, `<canvas>`, `<textarea>`) cannot be covered by normal view elements.
- Use `<cover-view>` / `<cover-image>` for overlays.

### 6.3 Global Event Bus

- [Standard] Use `uni.$emit` / `uni.$on` for cross-page events and always `uni.$off` in `onUnmounted`.

### 6.4 nextTick Necessity

- [Pitfall] Mutating state and immediately reading DOM size/scroll values, Use `nextTick()` before measuring UI.

## 7. Formatting & Style

### 7.1 Naming Conventions

- Name event handlers with `on<Element><Event>` (e.g., `onButtonClick`).

## 8. Documentation

### 8.1 Sections Division

- [Recommended] Separate data, computed, methods, watchers, and lifecycle hooks into distinct sections within `<script setup>` using comments.
