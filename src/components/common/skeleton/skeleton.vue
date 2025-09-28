<script lang="ts">
export default {
  name: "Skeleton",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import type { SkeletonRowCol, SkeletonRowColObj } from "./skeleton";
import { skeletonProps } from "./skeleton";

const props = defineProps(skeletonProps);

// builtin theme presets
const themeMap: Record<string, any> = {
  avatar: [{ type: "circle", height: "64px", width: "64px" }],
  image: [{ type: "rect", height: "64px", width: "64px" }],
  text: [
    1,
    [
      { width: "24%", height: "16px", marginRight: "16px" },
      { width: "76%", height: "16px" },
    ],
  ],
  paragraph: [1, 1, 1, { width: "55%" }],
};

const rowCols = ref<SkeletonRowCol[]>([]);

const parsedRowCols = computed(() => {
  return rowCols.value.map((item) => {
    if (typeof item === "number") {
      return [
        {
          class: getColItemClass({ type: "text" }),
          style: {},
        },
      ];
    }
    if (Array.isArray(item)) {
      return item.map((col) => ({
        ...col,
        class: getColItemClass(col),
        style: getColItemStyle(col),
      }));
    }
    const nItem = item as SkeletonRowColObj;
    return [
      {
        ...nItem,
        class: getColItemClass(nItem),
        style: getColItemStyle(nItem),
      },
    ];
  });
});

function getColItemClass(rowCol: SkeletonRowColObj) {
  return [
    "skeleton__col",
    `skeleton--type-${rowCol.type || "text"}`,
    { [`skeleton--animation-${props.animation}`]: !!props.animation },
  ];
}

function addUnit(value?: string | number) {
  if (value === undefined || value === null || value === "") return undefined;
  return typeof value === "number" ? `${value}px` : `${value}`;
}

function getColItemStyle(rowCol: SkeletonRowColObj) {
  const style: CSSProperties = {};
  const styleName = [
    "size",
    "width",
    "height",
    "margin",
    "background",
    "marginLeft",
    "marginRight",
    "borderRadius",
    "backgroundColor",
  ] as const;

  for (const name of styleName) {
    if (Object.prototype.hasOwnProperty.call(rowCol, name)) {
      const px = addUnit((rowCol as any)[name]);
      if (name === "size") {
        (style as any).width = px;
        (style as any).height = px;
      } else {
        (style as any)[name] = px as any;
      }
    }
  }
  return style;
}

const show = computed(() => props.loading === undefined || props.loading === true);

// sync internal rowCols when props change
watch(
  () => [props.rowCol, props.theme] as const,
  () => {
    const preset = themeMap[props.theme as string];
    const usePreset = Array.isArray(props.rowCol) && props.rowCol.length === 0;
    rowCols.value = [...(usePreset ? preset : (props.rowCol as any))];
  },
  { immediate: true }
);
</script>

<template>
  <view :class="['skeleton', props.customClass]" :style="props.customStyle">
    <view class="skeleton__content" v-if="show">
      <view class="skeleton__row" v-for="(row, index) in parsedRowCols" :key="`row-${index}`">
        <view v-for="(col, idx) in row" :key="`col-${idx}`" :class="col.class" :style="col.style" />
      </view>
    </view>
    <view v-else>
      <slot />
    </view>
  </view>
</template>

<style lang="scss" scoped src="./skeleton.scss"></style>
