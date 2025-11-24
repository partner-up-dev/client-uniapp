<script lang="ts">
export default {
  name: "ChatEntry",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { chatEntryProps, chatEntryEmits } from "./ChatEntry";
import { Chat, ChatType } from "@/business/communication/chat";
import { useChatStore } from "@/store/communication/chat";
import { Message } from "@/business/communication/message";
import Account from "@/components/account/account/account.vue";
import PRType from "@/components/partner_request/PRType/PRType.vue";
import { AccountBaseProfile } from "@/business/account/base";
import type { AccountSimple } from "@/business/account";
import { navigate } from "@/utils/vendor";
import { PAGE_ID } from "@/data/enum";
import { PartnerRequest } from "@/business/partner_request/base";
import dayjs from "dayjs";

const props = defineProps(chatEntryProps);
const emit = defineEmits(chatEntryEmits);

const chatStore = useChatStore();

const chat = ref<Chat | null>(null);
const pr = ref<PartnerRequest>();
const latestMessage = ref<Message | null>(null);
const senderAccount = ref<AccountSimple | null>(null);

onMounted(() => {
  Chat.get(props.chatId)
    .then((c) => {
      chat.value = c;

      if (isPrChat.value) {
        c.getPartnerRequest().then((prValue) => {
          pr.value = prValue;
        });
      }

      return Chat.get_messages(props.chatId, 0, 1, true);
    })
    .then((messages) => {
      if (messages.length > 0) {
        latestMessage.value = messages[0];
        return AccountBaseProfile.get(latestMessage.value.created_by);
      }
      return Promise.resolve(null);
    })
    .then((profile) => {
      if (profile && latestMessage.value) {
        senderAccount.value = {
          id: latestMessage.value.created_by,
          nickname: profile.nickname,
          avatar: profile.avatar || "",
        };
      }
    })
    .catch((error) => {
      console.error("Failed to load chat data:", error);
    });
});

const unreadCount = computed(() => chatStore.getChatUnread(props.chatId));

const isPrChat = computed(() => chat.value?.type === ChatType.PartnerRequest);

function onClick() {
  navigate({
    page_id: PAGE_ID.CHAT,
    params: { id: props.chatId.toString() },
  });
}
</script>

<template>
  <view class="chat-entry" @click="onClick">
    <!-- 第一行 -->
    <view class="row1">
      <view class="left">
        <text class="title">{{ chat?.title || "聊天" }}</text>
        <PRType v-if="isPrChat && pr" :pr="pr" />
      </view>
      <text class="time">{{
        dayjs(latestMessage?.created_at).format("HH:mm")
      }}</text>
    </view>

    <!-- 第二行 -->
    <view class="row2">
      <view class="left">
        <view class="sender" v-if="latestMessage">
          <Account :account="senderAccount" type="Avatar" size="xSmall" />
          <text class="nickname">{{ senderAccount?.nickname || "" }}</text>
        </view>
        <text class="content">{{ latestMessage?.contentAsText }}</text>
      </view>
      <view class="unread" v-if="unreadCount > 0">
        <text class="count">{{ unreadCount }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./ChatEntry.scss"></style>
