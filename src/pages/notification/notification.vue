<template>
  <view class="page-bg"></view>
  <safeAreaInset position="top" />
  <safeAreaInset position="wxmp-menu" />
  <view class="notification">
    <PUTabs class="header" v-model="activeTab" :tabs="tabs" size="Large" />
    <scroll-view
      :scroll-y="true"
      class="chat-list"
      :style="{ height: makeNumberPX(chatListHeight) }"
    >
      <ChatEntry v-for="chatId in chatList" :key="chatId" :chat-id="chatId" />
      <!-- ChatList content left blank as per requirements -->
      <!-- TODO add line between each elements -->
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { TABBAR_PAGE_ID } from "@/data/enum";
import { syncTabBarIndex } from "@/utils/tabbar";
import { useChatStore } from "@/store/communication/chat";
import { ChatType } from "@/business/communication/chat";

export default {
  name: "notification",
};

const MY_PAGE_ID = TABBAR_PAGE_ID.NOTIFICATION;
</script>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { PUTabs } from "@partner-up-dev/design-uniapp";
import safeAreaInset from "@/components/common/safeAreaInset.vue";
import { getWindowInfo, getElementRect, getSafeArea } from "@/utils/vendor";
import { makeNumberPX } from "@/utils/style";
import ChatEntry from "@/components/communication/ChatEntry/ChatEntry.vue";
import { onShow } from "@dcloudio/uni-app";

const activeTab = ref(0);
const chatStore = useChatStore();

const tabs = [
  { text: "搭子请求群聊", showDot: false, chatType: ChatType.PartnerRequest },
  { text: "搭子申请群聊", showDot: false, chatType: ChatType.PartnerApplication },
  { text: "私信", showDot: false, chatType: ChatType.DirectMessage },
];

const chatListTop = ref(0);

onMounted(() => {
  getElementRect(".chat-list", getCurrentInstance())
    .then((rect) => {
      chatListTop.value = rect.top || 0;
    })
    .catch((e) => {
      console.error("Failed to get chat-list top:", e);
    });
});

const windowInfo = getWindowInfo();
const safeArea = getSafeArea();
const chatListHeight = computed(() => {
  return windowInfo.screenHeight - chatListTop.value - safeArea.bottom - 55;
  // 55 for TabBar height
});

const chatList = computed(() => {
  const activeChatType = tabs[activeTab.value].chatType;
  return chatStore.my_chats
    .filter((chat) => chat.type === activeChatType)
    .map((chat) => chat._id);
});

onShow(() => {
  syncTabBarIndex(MY_PAGE_ID);
});
</script>

<style lang="scss" scoped src="./notification.scss"></style>
