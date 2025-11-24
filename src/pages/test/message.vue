<template>
  <view class="message-test-page">
    <view class="test-section">
      <text class="section-title">Message Component Test</text>

      <!-- Plain text message from me -->
      <view class="message-item">
        <text class="label">Plain text (me):</text>
        <Message v-if="myPlainMessage" :message="myPlainMessage"></Message>
      </view>

      <!-- Plain text message from other -->
      <view class="message-item">
        <text class="label">Plain text (other):</text>
        <Message v-if="otherPlainMessage" :message="otherPlainMessage"></Message>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Message from "@/components/communication/message/message.vue";
import {
  Message as MessageModel,
  MessageType,
} from "@/business/communication/message";

// tiny UUID v4 generator for mock data
function uuidv4() {
  // RFC4122 version 4 compliant simple generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Create test messages (use local mock only)
const myPlainMessage = ref<MessageModel | null>(null as any);
const otherPlainMessage = ref<MessageModel | null>(null as any);

onMounted(() => {
  // Always use local mock messages for the test page
  myPlainMessage.value = new MessageModel({
    _id: 1,
    chat: 1,
    created_at: new Date(),
    created_by: uuidv4(), // mock current user UUID
    viewed: [],
    type: MessageType.Plain,
    content: "Hello, this is my message!",
    replied_to: null,
    forwarded_from: null,
  });

  myPlainMessage.value.created_by = undefined; // simulate "by me"

  otherPlainMessage.value = new MessageModel({
    _id: 2,
    chat: 1,
    created_at: new Date(Date.now() - 60000), // 1 minute ago
    created_by: uuidv4(), // different mock user UUID
    viewed: [],
    type: MessageType.Plain,
    content: "Hi there! How are you doing?",
    replied_to: null,
    forwarded_from: null,
  });
});
</script>

<style lang="scss" scoped>
.message-test-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.test-section {
  background-color: #eee;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  display: block;
}

.message-item {
  margin-bottom: 20px;

  .label {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    display: block;
  }
}
</style>
