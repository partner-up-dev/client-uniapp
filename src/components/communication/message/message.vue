<script lang="ts">
export default {
  name: "message",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import AccountDisplay from "@/components/account/account/account.vue";
import { messageProps, messageEmits } from "./message";
import { AccountBaseProfile } from "@/business/account/base";
import PlainMsgContent from "@/components/communication/plainMsgContent/plainMsgContent.vue";

const props = defineProps(messageProps);
const emit = defineEmits(messageEmits);

const { baseProfile: createdByProfile } = AccountBaseProfile.use(
  props.message.created_by
);
const byMe = computed(() => !!props.message.byMe);
</script>

<template>
  <view class="msg" :class="{ 'msg--mine': message.byMe }">
    <!-- 头像（仅对方消息显示） -->
    <view v-if="!message.byMe" class="msg__A">
      <AccountDisplay type="Avatar" :account-id="message.created_by" />
    </view>

    <view class="msg__B">
      <!-- 发送人昵称 -->
      <text class="msg__nickname">{{ createdByProfile?.nickname }}</text>
      <!-- 消息内容: 使用 plainMsgContent 组件 -->
      <PlainMsgContent
        class="msg__content"
        :content="message.content"
        :byMe="byMe"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped src="./message.scss"></style>
