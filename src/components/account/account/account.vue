<script lang="ts">
export default {
  name: "Account",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import Avatar from "@/components/common/avatar/avatar.vue";
import { accountProps, accountEmits } from "./account";

const props = defineProps(accountProps);
const emit = defineEmits(accountEmits);

function onClick() {
  emit("click");
}
</script>

<template>
  <view
    id="account"
    :class="['account', props.customClass, `type-${props.type.toLowerCase()}`]"
    :style="props.customStyle"
    @click="onClick"
  >
    <Avatar
      :src="props.avatarSrc || undefined"
      :size="props.size"
      :radius="props.avatarRadius"
    />
    <text class="name">{{ props.nickname }}</text>
  </view>
</template>

<style lang="scss" scoped src="./account.scss"></style>
