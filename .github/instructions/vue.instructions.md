---
applyTo: "**/*.vue, **/composables/*.ts, **/use*.ts"
description: "Vue.js framework idioms and best practices. Follow these guidelines when editing the template, script sections or composables"
---

## 1. Syntax Usage

### 1.1 Component Definition

[Mandatory] Use Composition API with `<script setup>` syntax.

### 1.2 Reactivity

- [Recommended] Use ref for Primitives and Object References
- [Recommended] Use shallowRef for Large Data Structures
  - When dealing with large immutable datasets (e.g., large JSON trees from APIs, Map/GeoJSON data) that do not require deep reactivity, use shallowRef instead of ref.
  - Usage: Trigger updates by replacing the entire .value, or use triggerRef for internal mutations.
- [Standard] When accepting arguments in Composables that could be a value, a ref, or a getter, use toValue() (or unref in older versions) to normalize them.
  ```ts
  // Good: Flexible Composable Input
  function useFeature(input) {
    const value = toValue(input); // handles ref, getter, or raw value
    // ...
  }
  ```

### 1.3 Computed Properties

- [Mandatory] Use `computed(() => ...)` for derived state.
- [Forbidden] Do not execute side effects (e.g., async requests, DOM modifications, state mutations) inside a computed getter. Computed properties must be pure functions.

### 1.4 watch Timing & Cleanup

- [Critical] Understanding Flush Timing
  - watch defaults to flush: 'pre' (runs before DOM update).
  - If you need to access the updated DOM inside the watcher, use flush: 'post' (or watchPostEffect).
- [Mandatory] Side Effect Cleanup
  - Use the onCleanup callback in watchers to cancel stale network requests or timers.
    ```ts
    watch(id, async (newId, oldId, onCleanup) => {
      const controller = new AbortController();
      onCleanup(() => controller.abort());
      data.value = await fetch(`/api/${newId}`, { signal: controller.signal });
    });
    ```

## 2. Control Flow

### 2.1 Component Interface

- [Advanced] Multiple `v-model` bindings
  - Use specific names for `v-model` when a component manages multiple states, rather than generic props/emits.
  - Syntax: `v-model:title="pageTitle"` -> `defineProps(['title'])` + `defineEmits(['update:title'])`.
  - Use `const model = defineModel('title')`.

### 2.3 Dependency Injection (Provide/Inject)

- [Mandatory] Injection Keys
  - Always use Symbol as keys for provide/inject to avoid name collisions.
- [Pitfall] Reactivity Gaps
  - When providing a reactive object, ensure it is wrapped in ref or reactive. If you provide a raw value (e.g., provide('count', count.value)), the consumer receives a static value. Provide the ref itself.
  - Read-only: Use readonly() on provided state if the child should not mutate it.


## 3. Common Pitfalls & Subtle Bugs

### 3.1 nextTick Necessity

- [Pitfall] Mutating state and immediately trying to read the DOM height/width/scroll position.
  - Fix: Vue updates the DOM asynchronously. You must await nextTick() after state mutation before measuring DOM.
  ```ts
    const addItem = async () => {
    list.value.push(newItem);
    await nextTick();
    listContainer.value.scrollTop = listContainer.value.scrollHeight;
  };
  ```

## 4. Formatting & Style

### 4.1 Naming Conventions
- Name event handler with `on<Element><Event>` (eg. `onButtonClick`)

## 5. Documentation

### 5.1 Sections Division

- [Recommended] Separate data, computed, methods, and lifecycle hooks into distinct sections within the `<script setup>` block using comments.
  ```ts
  // --- data ---
  const count = ref(0);

  // --- computed ---
  const doubleCount = computed(() => count.value * 2);

  // --- methods ---
  function increment() {
    count.value++;
  }

  // --- watchers ---
  watch(count, (newVal) => {
    console.log('Count changed to', newVal);
  });

  // --- lifecycle hooks ---
  onMounted(() => {
    console.log('Component mounted');
  });
  ```
