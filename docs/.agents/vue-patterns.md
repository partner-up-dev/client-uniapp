# Vue Component Patterns

Standard patterns for Vue 3 components in this project.

## Component structure

Each component typically lives in its own folder:

- `<compName>.vue` — main component
- `<compName>.ts` — props/emits/types/helpers
- `<compName>.scss` — styles
- `<compName>.md` — component documentation

If a component name conflicts with a built-in element name, prefix it with `PU`.

## Standard template

Note: if a component/page defines local messages, use `useI18n({ inheritLocale: true, messages: localMessages })` for those local keys and keep `useTranslate()` for domain or global keys.

```vue
<script setup lang="ts">
import { defineProps, defineEmits, defineModel } from 'vue';
import { compNameProps, compNameEmits } from './compName';
import { useTranslate } from '@/locale';

// Props from separate module
const props = defineProps(compNameProps);

// Events from separate module
const emit = defineEmits(compNameEmits);

// v-model binding (when needed)
const modelValue = defineModel<string>();

// i18n
const { dt, t } = useTranslate('domain_name');

// Component logic here
</script>

<template>
  <view class="comp-name">
    <!-- UniApp tags only -->
  </view>
</template>

<style lang="scss" scoped src="./compName.scss"></style>
```

## Props definition (in separate .ts file)

```typescript
// compName.ts
import { PropType } from 'vue';

export const compNameProps = {
  title: {
    type: String as PropType<string>,
    required: true,
  },
  count: {
    type: Number as PropType<number>,
    default: 0,
  },
} as const;

export const compNameEmits = {
  change: (value: string) => true,
  click: () => true,
};

export type CompNameProps = typeof compNameProps;
export type CompNameEmits = typeof compNameEmits;
```

## Component options

For components that need specific Vue options:

```vue
<script setup lang="ts">
import { BasicComponentOptions } from '@/utils/vue';

export default {
  name: 'CompName',
  options: {
    ...BasicComponentOptions,
    // Additional options if needed
  },
};
</script>

<script setup lang="ts">
// Component logic
</script>
```

## defineModel pattern

For v-model bindings:

```vue
<script setup lang="ts">
const modelValue = defineModel<string>({
  default: '',
  required: false,
});

// Use modelValue.value to read/write
function updateValue(newVal: string) {
  modelValue.value = newVal;
}
</script>

<template>
  <input v-model="modelValue" />
</template>
```

## Common patterns

### Refs and reactive state

```typescript
import { ref, reactive, computed } from 'vue';

const count = ref(0);
const state = reactive({ name: '', age: 0 });
const doubled = computed(() => count.value * 2);
```

### Lifecycle hooks (UniApp)

```typescript
import { onLoad, onReady, onShow, onHide, onUnload } from '@dcloudio/uni-app';

onLoad((query) => {
  // Page loaded, parse route params
});

onReady(() => {
  // DOM ready
});

onShow(() => {
  // Page shown (every time)
});

onHide(() => {
  // Page hidden
});

onUnload(() => {
  // Cleanup
});
```

### Composables

Extract reusable logic:

```typescript
// composables/useCounter.ts
export function useCounter(initial = 0) {
  const count = ref(initial);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  return { count, increment, decrement };
}

// In component
const { count, increment } = useCounter(10);
```

## References

- Vue 3 docs: <https://vuejs.org/>
- UniApp lifecycle: <https://uniapp.dcloud.net.cn/tutorial/page.html>
- Project conventions: `docs/.agents/shared-conventions.md`
- Vue instruction file: `.github/instructions/vue.instructions.md`
