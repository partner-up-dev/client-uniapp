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
import { AccountBaseProfile } from "@/business/account/base";
import type { AccountSimple } from "@/business/account";
import { ref, onMounted } from "vue";
import { navigate } from "@/utils/vendor";
import { PAGE_ID } from "@/data/enum";

const props = defineProps(accountProps);
const emit = defineEmits(accountEmits);

const account = ref<AccountSimple | null>(props.account || null);

onMounted(() => {
  if (!account.value && props.accountId) {
    AccountBaseProfile.get(props.accountId).then((nAccount) => {
      account.value = nAccount;
    });
  }
});

function onClick() {
  emit("click");
  navigate({
    page_id: PAGE_ID.PROFILE,
    params: {
      id: account.value?.id,
    },
  });
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
      :src="account?.avatar || undefined"
      :size="props.size"
      :radius="props.avatarRadius"
    />
    <text class="name" v-if="props.type !== 'Avatar'">{{
      account?.nickname
    }}</text>
  </view>
</template>

<style lang="scss" scoped src="./account.scss"></style>
