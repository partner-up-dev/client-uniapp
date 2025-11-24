<script lang="ts">
export default {
  name: "PUNoticeBar",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { puNoticeBarProps, puNoticeBarEmits } from "./PUNoticeBar";

const props = defineProps(puNoticeBarProps);
const emit = defineEmits(puNoticeBarEmits);

const visible = ref(true);
const currentIndex = ref(0);

const textList = computed((): string[] => {
  if (Array.isArray(props.text)) {
    return props.text;
  }
  return [props.text];
});

const currentText = computed((): string => {
  if (props.direction === "vertical" && textList.value.length > 0) {
    return textList.value[currentIndex.value % textList.value.length];
  }
  return textList.value.join(" ");
});

const onClose = () => {
  visible.value = false;
  emit("close");
};

const onClick = () => {
  emit("click");
};

// Vertical text rotation
let timer: number | undefined;
if (props.direction === "vertical" && textList.value.length > 1) {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % textList.value.length;
  }, 3000);
}

// Cleanup timer on unmount
import { onUnmounted } from "vue";
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <view
    v-if="visible"
    class="pu-notice-bar"
    :class="{ 'pu-notice-bar--wrapable': wrapable }"
    :style="{
      backgroundColor: backgroundColor,
      color: color,
    }"
    @click="onClick"
  >
    <view v-if="prefix" class="pu-notice-bar__prefix">
      <text :class="`i-mdi-${prefix}`" class="pu-notice-bar__icon"></text>
    </view>

    <view class="pu-notice-bar__content">
      <view
        class="pu-notice-bar__text"
        :class="{
          'pu-notice-bar__text--scrollable': scrollable && direction === 'horizontal',
          'pu-notice-bar__text--vertical': direction === 'vertical',
        }"
      >
        <text>{{ currentText }}</text>
      </view>
    </view>

    <view v-if="closeable" class="pu-notice-bar__close" @click.stop="onClose">
      <text class="i-mdi-close pu-notice-bar__icon"></text>
    </view>
  </view>
</template>

<style scoped lang="scss" src="./PUNoticeBar.scss"></style>
