<script lang="ts">
export default {
  name: "ChatContent",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  getCurrentInstance,
} from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import {
  chatContentProps,
  chatContentEmits,
  DEFAULT_MESSAGE_OFFSET,
} from "./ChatContent";
import { Chat } from "@/business/communication/chat";
import { Message } from "@/business/communication/message";
import MessageComponent from "../message/message.vue";
import { useScrollToBottom } from "@/composables/useScroll";
import { usePulldownRefresher, getElementRect } from "@/utils/vendor";
import { makeNumberPX } from "@/utils/style";

const props = defineProps(chatContentProps);
const emit = defineEmits(chatContentEmits);

// ==================== 响应式数据 ====================
const messages = ref<Message[]>([]);
const loading = ref(false);
const scrollViewHeight = ref<number>();
const chatContentRef = ref<HTMLElement | null>(null);

// 使用 useScrollToBottom composable
const { scrollTop, scrollToBottom } = useScrollToBottom(
  () => `#message-${messages.value.length}`,
  getCurrentInstance()
);

// ==================== 计算属性 ====================
const hasMessages = computed(() => messages.value.length > 0);

const messageClass = computed(() => (index: number) => ({
  "chat-content__message-item": true,
  "space-m-t-sm": index !== 0,
  [`message-${index}`]: true,
}));

const scrollViewStyle = computed(() => ({
  height: scrollViewHeight.value ? makeNumberPX(scrollViewHeight.value) : "auto",
}));

// ==================== 方法 ====================
/**
 * 获取聊天消息列表
 */
async function getMessages() {
  if (loading.value) return;

  loading.value = true;

  Chat.get_messages(
    props.chatId,
    0, // start from beginning
    DEFAULT_MESSAGE_OFFSET, // load default amount
    false // ascending order (oldest first, newest at bottom)
  )
    .then((messageList) => {
      messages.value = messageList;
      emit("messagesLoaded", messageList.length);

      // 滚动到底部显示最新消息
      return nextTick();
    })
    .then(() => {
      scrollToBottom();
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 滚动到最新消息（底部）
 */
function scrollToBottomMethod() {
  scrollToBottom();
}

// ==================== 生命周期和监听 ====================
// 监听 chatId 变化
watch(
  () => props.chatId,
  (newChatId) => {
    if (newChatId) {
      getMessages();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.chatId) {
    getMessages();
  }
});

// 暴露方法给父组件
defineExpose({
  getMessages,
  scrollToBottom: scrollToBottomMethod,
});

// 使用 usePulldownRefresher
const {
  is_refreshing,
  onRefresherPulling,
  onRefresherRestored,
  onRefresherRefresh,
} = usePulldownRefresher(getMessages);

onMounted(() => {
  setTimeout(() => {
    getElementRect(".chat-content", getCurrentInstance()).then((rect) => {
      scrollViewHeight.value = (rect.height || 0) - 32; // 16px padding top/bottom
    });
  }, 200);
});
</script>

<template>
  <view class="chat-content">
    <!-- Scroll View 模式 -->
    <scroll-view
      v-if="props.mode === 'scroll-view'"
      :style="scrollViewStyle"
      :scrollTop="scrollTop"
      ref="chatContentRef"
      scrollWithAnimation
      scrollAnchoring
      enhanced
      :show-scrollbar="false"
      @refresherpulling="onRefresherPulling"
      @refresherrestore="onRefresherRestored"
      @refresherrefresh="onRefresherRefresh"
      @scrolltoupper="getMessages"
    >
      <!-- 加载状态 -->
      <div v-if="loading" class="chat-content__loading">
        <text class="loading-text">加载中...</text>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!hasMessages" class="chat-content__empty">
        <text class="empty-text">暂无消息</text>
      </div>

      <!-- 消息列表 -->
      <template v-else>
        <MessageComponent
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
          :class="messageClass(index)"
        />
      </template>
    </scroll-view>

    <!-- Flex 模式 -->
    <view v-else class="chat-content--flex">
      <!-- 加载状态 -->
      <div v-if="loading" class="chat-content__loading">
        <text class="loading-text">加载中...</text>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!hasMessages" class="chat-content__empty">
        <text class="empty-text">暂无消息</text>
      </div>

      <!-- 消息列表 -->
      <template v-else>
        <MessageComponent
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
          :class="messageClass(index)"
        />
      </template>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./ChatContent.scss"></style>
