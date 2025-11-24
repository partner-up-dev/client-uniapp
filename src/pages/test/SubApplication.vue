<template>
  <view class="sub-app editablea">
    <SubApplication
      :sub-application="editableSubApp"
      :editable="true"
      @delete="onDelete"
    />
  </view>

  <view id="readonly">
    <SubApplication :sub-application="readonlySubApp" :editable="false" />
  </view>

  <view class="empty-rationale-sub-app">
    <SubApplication :sub-application="emptyRationaleSubApp" :editable="true" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SubApplication from "@/components/partner_request/SubApplication/SubApplication.vue";
import { PartnerSubApplication } from "@/business/partner_request/application";

// 创建测试用的子申请数据
const editableSubApp = ref(
  new PartnerSubApplication({
    role: 1,
    rationale: "我非常喜欢这个角色，希望能够参与其中",
  })
);

const readonlySubApp = ref(
  new PartnerSubApplication({
    role: 2,
    rationale: "我有丰富的相关经验，可以胜任这个角色",
  })
);

const emptyRationaleSubApp = ref(
  new PartnerSubApplication({
    role: 3,
    rationale: null,
  })
);

const onDelete = (subApp: PartnerSubApplication) => {
  console.log("Delete clicked:", subApp);
};
</script>

<style lang="scss" scoped></style>
