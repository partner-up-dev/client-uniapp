# Vue Component Patterns

Standard patterns for Vue 3 components in this project.

Applies to components in `src/components/` only. Pages do not define props, emits, or models.

## Component structure

Each component typically lives in its own folder:

- `<compName>.vue` — main component
- `<compName>.ts` — props/emits/types/helpers
- `<compName>.scss` — styles
- `<compName>.md` — component documentation

If a component name conflicts with a built-in element name, prefix it with `PU`.

## Standard template

```vue
<script setup lang="ts">
import { defineProps, defineEmits, defineModel } from 'vue';
import { compNameProps, compNameEmits } from './compName';
import { useTranslate } from '@/locale/use';

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

## References

- Vue 3 docs: <https://vuejs.org/>
- UniApp lifecycle: <https://uniapp.dcloud.net.cn/tutorial/page.html>
- Project conventions: `docs/.agents/shared-conventions.md`
- Vue instruction file: `.github/instructions/vue.instructions.md`
