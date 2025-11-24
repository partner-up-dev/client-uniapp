<template>
  <view
    :class="`pu-accordion ${viewmore ? 'is-viewmore' : ''} ${customClass}`"
    :style="customStyle"
  >
    <!-- 普通或手风琴模式 -->
    <block v-if="!viewmore">
      <slot></slot>
    </block>
    <!-- 查看更多模式 -->
    <view v-else>
      <view
        :class="`pu-accordion__content ${!modelValue ? 'is-retract' : ''}`"
        :style="`-webkit-line-clamp: ${contentLineNum}; -webkit-box-orient: vertical`"
      >
        <slot></slot>
      </view>
      <view class="pu-accordion__more" @click="handleMore">
        <!-- 自定义展开按钮 -->
        <view v-if="useMoreSlot" :class="customMoreSlotClass">
          <slot name="more"></slot>
        </view>
        <!-- 显示展开或折叠按钮 -->
        <block v-else>
          <text class="pu-accordion__more-txt">
            {{ !modelValue ? "展开" : "收起" }}
          </text>
          <view :class="`pu-accordion__arrow ${modelValue ? 'is-retract' : ''}`">
            <text class="i-mdi-chevron-down"></text>
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { BasicComponentOptions } from "@/utils/vue";

export default {
  name: "PUAccordion",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { onBeforeMount, provide, ref, watch } from "vue";
import {
  puAccordionProps,
  puAccordionEmits,
  PUACCORDION_KEY,
  type AccordionToggleAllOptions,
  type PUAccordionExpose,
} from "./PUAccordion";

const props = defineProps(puAccordionProps);
const emit = defineEmits(puAccordionEmits);

const contentLineNum = ref<number>(0); // 查看更多的折叠面板，收起时的显示行数
const children = ref<any[]>([]); // 存储子项

// 提供上下文给子组件
provide(PUACCORDION_KEY, {
  props,
  toggle,
});

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    const { viewmore, accordion } = props;
    // 手风琴状态下 value 类型只能为 string
    if (accordion && typeof newVal !== "string") {
      console.error("[PUAccordion] accordion modelValue must be string");
    } else if (!accordion && !viewmore && !Array.isArray(newVal)) {
      console.error("[PUAccordion] modelValue must be Array in normal mode");
    }
  },
  { deep: true }
);

// 监听 lineNum 变化
watch(
  () => props.lineNum,
  (newVal) => {
    if (newVal <= 0) {
      console.error("[PUAccordion] lineNum must be greater than 0");
    }
  },
  { deep: true, immediate: true }
);

onBeforeMount(() => {
  const { lineNum, viewmore, modelValue } = props;
  contentLineNum.value = viewmore && !modelValue ? lineNum : 0;
});

function updateChange(activeNames: string | string[] | boolean) {
  emit("update:modelValue", activeNames);
  emit("change", {
    value: activeNames,
  });
}

function toggle(name: string, expanded: boolean) {
  const { accordion, modelValue } = props;
  if (accordion) {
    updateChange(name === modelValue ? "" : name);
  } else if (expanded) {
    updateChange((modelValue as string[]).concat(name));
  } else {
    updateChange(
      (modelValue as string[]).filter((activeName) => activeName !== name)
    );
  }
}

/**
 * 切换所有面板展开状态，传 true 为全部展开，false 为全部收起，不传参为全部切换
 * @param options 面板状态
 */
const toggleAll = (options: AccordionToggleAllOptions = {}) => {
  if (props.accordion) {
    console.warn("[PUAccordion] toggleAll is not supported in accordion mode");
    return;
  }

  if (typeof options === "boolean") {
    options = { expanded: options };
  }

  const { expanded, skipDisabled } = options;
  const names: string[] = [];

  children.value.forEach((item, index) => {
    if (item.disabled && skipDisabled) {
      if (item.getExpanded && item.getExpanded()) {
        names.push(item.name || index.toString());
      }
    } else if (
      expanded !== undefined
        ? expanded
        : !(item.getExpanded && item.getExpanded())
    ) {
      names.push(item.name || index.toString());
    }
  });

  updateChange(names);
};

/**
 * 查看更多点击
 */
function handleMore() {
  emit("update:modelValue", !props.modelValue);
  emit("change", {
    value: !props.modelValue,
  });
}

// 注册子组件
const linkChild = (child: any) => {
  children.value.push(child);
};

// 卸载子组件
const unlinkChild = (child: any) => {
  const index = children.value.indexOf(child);
  if (index !== -1) {
    children.value.splice(index, 1);
  }
};

defineExpose<PUAccordionExpose>({
  toggleAll,
});
</script>

<style lang="scss" scoped src="./PUAccordion.scss"></style>
