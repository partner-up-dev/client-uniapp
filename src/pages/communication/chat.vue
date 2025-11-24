<script lang="ts">
export default {
  name: "chat",
};
</script>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import * as v from "valibot";
import { Chat } from "@/business/communication/chat";
import { Message } from "@/business/communication/message";
import ChatContent from "@/components/communication/ChatContent/ChatContent.vue";
import safeAreaInset from "@/components/common/safeAreaInset.vue";
import PUTextarea from "@/components/common/PUTextarea/PUTextarea.vue";
import NavBar from "@/components/common/navBar/navBar.vue";
import ScaffoldLayout from "@/components/common/layout/scaffoldLayout.vue";
import type { ChatPageParams } from "./chat";
import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from "./chat";
import { errorReport } from "@/utils/vendor";

// ==================== 页面参数 ====================
const pageParams = ref<ChatPageParams>();

const paramsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.transform((value) => parseInt(value, 10))
  ),
});

onLoad((query) => {
  pageParams.value = v.parse(paramsSchema, query);
  loadChatData();
});

// ==================== 数据 ====================
const chat = ref<Chat>();
const messageContent = ref("");
const chatContentRef = ref();
const isLoadingChat = ref(false);
const isSending = ref(false);

// ==================== 计算属性 ====================
const chatId = computed(() => pageParams.value?.id);
const chatTitle = computed(() => chat.value?.title || "聊天");
const canSend = computed(() => {
  const content = messageContent.value.trim();
  return (
    content.length >= MIN_MESSAGE_LENGTH &&
    content.length <= MAX_MESSAGE_LENGTH &&
    !isSending.value
  );
});

// ==================== 方法 ====================

/**
 * 加载聊天数据
 */
function loadChatData() {
  if (!chatId.value) return;

  isLoadingChat.value = true;
  Chat.get(chatId.value)
    .then((chatData) => {
      chat.value = chatData;
    })
    .catch((error) => {
      console.error("Failed to load chat:", error);
      errorReport("加载聊天失败");
    })
    .finally(() => {
      isLoadingChat.value = false;
    });
}

/**
 * 刷新消息列表
 */
function onRefreshButtonClick() {
  if (chatContentRef.value?.getMessages) {
    chatContentRef.value.getMessages();
  }
}

/**
 * 发送消息
 */
function onSendButtonClick() {
  if (!canSend.value || !chatId.value) return;

  const content = messageContent.value.trim();
  isSending.value = true;

  Message.send(chatId.value, content)
    .then((newMessage) => {
      // 清空输入框
      messageContent.value = "";
      // 刷新消息列表以显示新消息
      return nextTick();
    })
    .then(() => {
      if (chatContentRef.value?.getMessages) {
        chatContentRef.value.getMessages();
      }
    })
    .catch((error) => {
      console.error("Failed to send message:", error);
      errorReport("发送消息失败");
    })
    .finally(() => {
      isSending.value = false;
    });
}

/**
 * 处理更多按钮点击
 */
function onMoreButtonClick() {
  // TODO: 实现更多功能菜单
  uni.showToast({
    title: "更多功能",
    icon: "none",
  });
}
</script>

<template>
  <view class="page-bg"></view>
  <ScaffoldLayout>
    <template #header>
      <NavBar
        :title="chatTitle"
        @refresh="onRefreshButtonClick"
        @more="onMoreButtonClick"
      />
    </template>

    <!-- 聊天内容区域 -->
    <ChatContent
      v-if="chatId"
      class="chat-page__content"
      ref="chatContentRef"
      :chat-id="chatId"
      mode="scroll-view"
    />

    <template #footer>
      <view class="chat-page__footer-container">
        <view class="chat-page__footer">
          <PUTextarea
            class="field"
            v-model="messageContent"
            :placeholder="'输入消息文本'"
            :maxlength="MAX_MESSAGE_LENGTH"
            :height="28"
          />

          <!-- TODO Reuse PUButton -->
          <view
            class="send-button"
            :class="{ 'send-button--disabled': !canSend }"
            @click="onSendButtonClick"
          >
            <text class="i-mdi-send icon"></text>
          </view>
        </view>
        <!-- 底部安全区域 -->
        <safeAreaInset position="bottom" />
      </view>
    </template>
  </ScaffoldLayout>
</template>

<style lang="scss" scoped src="./chat.scss"></style>
