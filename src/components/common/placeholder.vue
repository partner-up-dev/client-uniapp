<script lang="ts">
// types
import type { PropType } from "vue";

// utils
import i18n from "@/locale";
import { baseProps } from "@/utils/props";
import { BasicComponentOptions } from "@/utils/vue";

export default {
  name: "placeholder",

  options: BasicComponentOptions,

  props: {
    text: {
      type: String,
      default: i18n.global.t("common.placeholder.empty"),
    },
    underline: {
      type: Boolean,
    },
    padding: {
      type: String,
      default: "6px 4px",
    },
    to: {
      type: String,
    },
    ...baseProps,
  },

  methods: {
    handleClicked() {
      this.$emit("click");

      // navigateTo
      if (this.to) {
        uni.navigateTo({
          url: this.to,
        });
      }
    },
  },

  emits: {
    click() {},
  },
};
</script>

<template>
  <view class="placeholder" @click="handleClicked">
    <label>{{ text }}</label>
  </view>
</template>

<style lang="scss" scoped>
@use "@/styles/main.scss" as *;

.placeholder {
  @extend .placeholder-base;

  @include pu-font("label-medium");
  color: $pu-color-on-surface-variant;

  text-decoration: v-bind("underline ? 'underline' : 'none'");

  padding: v-bind("padding");
}
</style>
