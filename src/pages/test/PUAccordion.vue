<template>
  <view class="page">
    <view class="section">
      <text class="section-title">基础用法</text>
      <PUAccordion v-model="activeNames1">
        <PUAccordionItem name="1" title="标题1">
          <view class="content">这是第一个面板的内容</view>
        </PUAccordionItem>
        <PUAccordionItem name="2" title="标题2">
          <view class="content">这是第二个面板的内容</view>
        </PUAccordionItem>
        <PUAccordionItem name="3" title="标题3">
          <view class="content">这是第三个面板的内容</view>
        </PUAccordionItem>
      </PUAccordion>
    </view>

    <view class="section">
      <text class="section-title">手风琴模式</text>
      <PUAccordion v-model="activeName2" accordion>
        <PUAccordionItem name="1" title="标题1">
          <view class="content">手风琴模式下，同时只能展开一个面板</view>
        </PUAccordionItem>
        <PUAccordionItem name="2" title="标题2">
          <view class="content">点击其他面板会自动收起当前面板</view>
        </PUAccordionItem>
        <PUAccordionItem name="3" title="标题3">
          <view class="content">适用于需要聚焦单个内容的场景</view>
        </PUAccordionItem>
      </PUAccordion>
    </view>

    <view class="section">
      <text class="section-title">禁用状态</text>
      <PUAccordion v-model="activeNames3">
        <PUAccordionItem name="1" title="标题1">
          <view class="content">这是正常的面板</view>
        </PUAccordionItem>
        <PUAccordionItem name="2" title="标题2（禁用）" disabled>
          <view class="content">这个面板被禁用了</view>
        </PUAccordionItem>
        <PUAccordionItem name="3" title="标题3">
          <view class="content">这是另一个正常的面板</view>
        </PUAccordionItem>
      </PUAccordion>
    </view>

    <view class="section">
      <text class="section-title">查看更多模式</text>
      <PUAccordion v-model="expanded4" viewmore :line-num="3">
        这是一段很长的文本内容，在收起状态下只显示前3行。当用户点击展开按钮时，会显示完整内容。
        这种模式常用于文章摘要、商品描述等场景。可以通过 lineNum
        属性控制收起时显示的行数。
        这里有更多的内容，展开后才能看到。这是第四行内容。这是第五行内容。这是第六行内容。
      </PUAccordion>
    </view>

    <view class="section">
      <text class="section-title">切换所有面板</text>
      <view class="actions">
        <button @click="expandAll" class="action-btn">全部展开</button>
        <button @click="collapseAll" class="action-btn">全部收起</button>
      </view>
      <PUAccordion ref="accordionRef5" v-model="activeNames5">
        <PUAccordionItem name="1" title="面板1">
          <view class="content">内容1</view>
        </PUAccordionItem>
        <PUAccordionItem name="2" title="面板2">
          <view class="content">内容2</view>
        </PUAccordionItem>
        <PUAccordionItem name="3" title="面板3">
          <view class="content">内容3</view>
        </PUAccordionItem>
      </PUAccordion>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PUAccordionTest",
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import PUAccordion from "@/components/common/PUAccordion/PUAccordion.vue";
import PUAccordionItem from "@/components/common/PUAccordion/PUAccordionItem.vue";
import type { PUAccordionExpose } from "@/components/common/PUAccordion/PUAccordion";

// 基础用法
const activeNames1 = ref<string[]>(["1"]);

// 手风琴模式
const activeName2 = ref<string>("1");

// 禁用状态
const activeNames3 = ref<string[]>([]);

// 查看更多模式
const expanded4 = ref<boolean>(false);

// 切换所有面板
const activeNames5 = ref<string[]>([]);
const accordionRef5 = ref<PUAccordionExpose>();

const expandAll = () => {
  accordionRef5.value?.toggleAll(true);
};

const collapseAll = () => {
  accordionRef5.value?.toggleAll(false);
};
</script>

<style scoped lang="scss">
@use "@/styles/main.scss" as *;

.page {
  padding: $pu-spacing-med;
  background: $pu-color-surface;
  min-height: 100vh;
}

.section {
  margin-bottom: $pu-spacing-lg;

  &-title {
    display: block;
    font-size: 18px;
    font-weight: 500;
    color: $pu-color-on-surface;
    margin-bottom: $pu-spacing-sm;
  }
}

.content {
  padding: $pu-spacing-sm 0;
  color: $pu-color-on-surface;
  line-height: 1.5;
}

.actions {
  display: flex;
  gap: $pu-spacing-sm;
  margin-bottom: $pu-spacing-sm;
}

.action-btn {
  flex: 1;
  padding: $pu-spacing-sm;
  background: $pu-color-primary-container;
  color: $pu-color-primary-container-on;
  border: none;
  border-radius: $pu-radius-sm;
  font-size: 14px;
}
</style>
