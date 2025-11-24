<template>
  <view
    :class="`pu-accordion-item ${disabled ? 'is-disabled' : ''} ${customClass}`"
    :style="customStyle"
  >
    <view
      :class="`pu-accordion-item__header ${expanded ? 'is-expanded' : ''} ${
        isFirst ? 'pu-accordion-item__header-first' : ''
      } ${$slots.title ? 'is-custom' : ''}`"
      @click="handleClick"
    >
      <slot
        name="title"
        :expanded="expanded"
        :disabled="disabled"
        :isFirst="isFirst"
      >
        <text class="pu-accordion-item__title">{{ title }}</text>
        <text
          :class="`pu-accordion-item__arrow ${
            expanded ? 'is-retract' : ''
          } i-mdi-chevron-down`"
        />
      </slot>
    </view>
    <view
      class="pu-accordion-item__wrapper"
      :style="contentStyle"
      @transitionend="handleTransitionEnd"
    >
      <view
        class="pu-accordion-item__body"
        :class="customBodyClass"
        :style="customBodyStyle"
        :id="accordionId"
      >
        <slot />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";

export default {
  name: "PUAccordionItem",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, onMounted, ref, watch } from "vue";
import {
  puAccordionItemProps,
  puAccordionItemEmits,
  type PUAccordionItemExpose,
} from "./PUAccordionItem";
import { PUACCORDION_KEY } from "./PUAccordion";

const accordionId = ref<string>(
  `accordion-item-${Math.random().toString(36).slice(2, 11)}`
);

const props = defineProps(puAccordionItemProps);
const emit = defineEmits(puAccordionItemEmits);

const accordion = inject(PUACCORDION_KEY, null);
const { proxy } = getCurrentInstance() as any;

const height = ref<string | number>("");
const inited = ref<boolean>(false);
const expanded = ref<boolean>(false);
const index = ref<number>(0);

/**
 * 是否是第一个
 */
const isFirst = computed(() => {
  return index.value === 0;
});

/**
 * 容器样式，(动画)
 */
const contentStyle = computed(() => {
  const styles: Record<string, string> = {};
  if (inited.value) {
    styles.transition = "height 0.3s ease-in-out";
  }
  if (!expanded.value) {
    styles.height = "0px";
  } else if (height.value) {
    styles.height =
      typeof height.value === "number" ? `${height.value}px` : height.value;
  }
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
});

/**
 * 是否选中
 */
const isSelected = computed(() => {
  const modelValue = accordion ? accordion.props.modelValue || [] : [];
  const { name } = props;
  return (
    (typeof modelValue === "string" && modelValue === name) ||
    (Array.isArray(modelValue) && modelValue.indexOf(name as string) >= 0)
  );
});

watch(
  () => isSelected.value,
  (newVal) => {
    updateExpand(newVal);
  }
);

onMounted(() => {
  updateExpand(isSelected.value);
});

async function updateExpand(useBeforeExpand: boolean = true) {
  try {
    if (useBeforeExpand) {
      await handleBeforeExpand();
    }
    initRect();
  } catch (error) {
    /* empty */
  }
}

function initRect() {
  uni
    .createSelectorQuery()
    .in(proxy)
    .select(`#${accordionId.value}`)
    .boundingClientRect((rect: any) => {
      if (rect) {
        const { height: rectHeight } = rect;
        height.value = rectHeight || "";

        setTimeout(() => {
          if (isSelected.value) {
            expanded.value = true;
          } else {
            expanded.value = false;
          }
          if (!inited.value) {
            inited.value = true;
          }
        }, 0);
      }
    })
    .exec();
}

function handleTransitionEnd() {
  if (expanded.value) {
    height.value = "";
  }
}

// 点击子项
async function handleClick() {
  if (props.disabled) return;
  try {
    await updateExpand();
    const { name } = props;
    accordion && accordion.toggle(name, !expanded.value);
  } catch (error) {
    /* empty */
  }
}

/**
 * 展开前钩子
 */
function handleBeforeExpand() {
  return new Promise<void>((resolve, reject) => {
    const { name } = props;
    const nextExpanded = !expanded.value;
    if (nextExpanded && props.beforeExpand) {
      const response = props.beforeExpand(name);
      if (!response) {
        reject();
      }
      if (response instanceof Promise) {
        response.then(() => resolve()).catch(reject);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
}

function getExpanded() {
  return expanded.value;
}

defineExpose<PUAccordionItemExpose>({ getExpanded, updateExpand });
</script>

<style lang="scss" scoped src="./PUAccordionItem.scss"></style>
