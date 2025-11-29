<template>
  <view>
    <view class="section">
      <text class="section-title">基础用法 - 带默认 NavBar</text>
      <ScaffoldLayout>
        <view class="demo-content">
          <text>这是内容区域，高度自动填充</text>
        </view>
        <template #footer>
          <view class="demo-footer">这是 Footer</view>
        </template>
      </ScaffoldLayout>
    </view>

    <view class="section">
      <text class="section-title">自定义 Header</text>
      <ScaffoldLayout>
        <template #header>
          <view class="custom-header">自定义 Header</view>
        </template>
        <view class="demo-content">
          <text>自定义 Header 的内容区域</text>
        </view>
        <template #footer>
          <view class="demo-footer">Footer 区域</view>
        </template>
      </ScaffoldLayout>
    </view>

    <view class="section">
      <text class="section-title">无 Footer</text>
      <ScaffoldLayout :show-footer="false">
        <view class="demo-content">
          <text>没有 Footer 的布局</text>
        </view>
      </ScaffoldLayout>
    </view>

    <view class="section">
      <text class="section-title">完整示例 - 带 NavBar</text>
      <ScaffoldLayout>
        <template #header>
          <NavBar
            title="示例页面"
            :show-refresh="true"
            :show-more="true"
            @refresh="onRefresh"
            @more="onMore"
          />
        </template>
        <view class="demo-content scrollable">
          <text class="demo-text">这是一个完整的示例</text>
          <text class="demo-text">内容区域可以滚动</text>
          <text class="demo-text">Header 使用 NavBar 组件</text>
          <text class="demo-text">Footer 包含操作按钮</text>
        </view>
        <template #footer>
          <view class="demo-footer with-actions">
            <button class="action-btn">取消</button>
            <button class="action-btn primary">确定</button>
          </view>
        </template>
      </ScaffoldLayout>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "ScaffoldLayoutTest",
};
</script>

<script setup lang="ts">
import ScaffoldLayout from "@/components/common/layout/scaffoldLayout.vue";
import NavBar from "@/components/common/navBar/navBar.vue";

function onRefresh() {
  uni.showToast({
    title: "刷新",
    icon: "none",
  });
}

function onMore() {
  uni.showToast({
    title: "更多",
    icon: "none",
  });
}
</script>

<style scoped lang="scss">


.section {
  margin-bottom: sys-var(spacing, lg);
  border: 1px solid sys-var(color, outline);
  border-radius: sys-var(radius, med);
  overflow: hidden;

  &-title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: sys-var(color, on-surface);
    padding: sys-var(spacing, sm) sys-var(spacing, med);
    background: sys-var(color, surface-container);
  }
}

.custom-header {
  padding: sys-var(spacing, med);
  background: sys-var(color, primary);
  color: sys-var(color, on-primary);
  font-weight: 500;
}

.demo-content {
  padding: sys-var(spacing, med);
  background: sys-var(color, surface);
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  &.scrollable {
    flex-direction: column;
    gap: sys-var(spacing, sm);
  }
}

.demo-text {
  display: block;
  color: sys-var(color, on-surface);
  line-height: 1.5;
}

.demo-footer {
  padding: sys-var(spacing, med);
  background: sys-var(color, surface-container);
  color: sys-var(color, on-surface);
  text-align: center;

  &.with-actions {
    display: flex;
    gap: sys-var(spacing, sm);
  }
}

.action-btn {
  flex: 1;
  padding: sys-var(spacing, sm);
  background: sys-var(color, surface-container);
  color: sys-var(color, on-surface);
  border: 1px solid sys-var(color, outline);
  border-radius: sys-var(radius, sm);
  font-size: 14px;

  &.primary {
    background: sys-var(color, primary);
    color: sys-var(color, on-primary);
    border-color: sys-var(color, primary);
  }
}
</style>
