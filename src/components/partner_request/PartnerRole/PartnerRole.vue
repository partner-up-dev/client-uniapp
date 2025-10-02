<script lang="ts">
export default {
  name: "PartnerRole",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { BasicComponentOptions } from "@/utils/vue";
import { partnerRoleProps, partnerRoleEmits } from "./PartnerRole";
import { PartnerRole } from "@/business/partner_request/partner";

const props = defineProps(partnerRoleProps);
const emit = defineEmits(partnerRoleEmits);

if (!props.role && !props.roleId) {
  throw new Error("PartnerRole 组件必须传入 role 或 roleId 属性");
}

const { partnerRole } = PartnerRole.use(props.roleId, props.role);

function onClick() {
  if (partnerRole.value) {
    emit("click", partnerRole.value);
  } else {
    console.warn("PartnerRole not ready yet");
  }
}
</script>

<template>
  <view
    class="bg-surface-container border border-solid border-outline p-x-med p-y-sm flex flex-col gap-sm"
    @click="onClick"
  >
    <view class="flex gap-sm items-start">
      <text class="color-surface-on-variant font-body-large font-mono">
        #{{ partnerRole?.id }}
      </text>
      <text class="color-surface-on font-body-large">{{
        partnerRole?.name
      }}</text>
    </view>
    <view class="color-surface-on font-label-large">
      {{ partnerRole?.rule }}
    </view>
  </view>
</template>

<style lang="scss" scoped src="./PartnerRole.scss"></style>
