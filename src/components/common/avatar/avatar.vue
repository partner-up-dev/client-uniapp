<script lang="ts">
export default {
  name: "Avatar",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { kebabCase } from "@/utils";
import { avatarProps, avatarEmits } from "./avatar";
import { uploadObj, useChooseImage } from "@/business/oss";
import { PUImg, PUImgCropper } from "@partner-up-dev/design-uniapp";
import Badge from "@/components/common/badge/badge.vue";

const props = defineProps(avatarProps);
defineEmits(avatarEmits);

const { chooseImageAndUpload } = useChooseImage();
const showCropper = ref(false);
const cropperImgSrc = ref("");
const imgT = ref(0);

function onCropperConfirm({ tempFilePath }: { tempFilePath: string }) {
  const bucket = props.uploadBucket;
  const key = props.uploadKey;

  if (!bucket || !key) {
    console.warn("Avatar: uploadBucket and uploadKey are required for editing");
    return;
  }

  uploadObj(bucket, key, tempFilePath)
    .then(() => {
      imgT.value += 1;
    })
    .finally(() => {
      showCropper.value = false;
    });
}

function onImgClick() {
  if (!props.editable) return;
  chooseImageAndUpload(props.uploadBucket, props.uploadKey);
}
</script>

<template>
  <view id="avatar" :class="['avatar', props.customClass]" @click="onImgClick">
    <Badge
      custom-style="line-height: 0.8"
      :max="props.badgeMax"
      :modelValue="props.badge"
      :right="0"
      :bottom="0"
    >
      <PUImg
        :size="props.size"
        :src="`${props.src}?t=${imgT}`"
        :radius="props.radius"
        custom-image="img"
      >
        <template #error>
          <view class="error-wrap">
            <text class="i-mdi-emotion-dead error-indicator" />
          </view>
        </template>
        <template #loading>
          <!-- TODO replace with skeleton -->
          <view class="loading-wrap">
            <wd-loading color="#96d945" :size="24" />
          </view>
        </template>
      </PUImg>

      <text v-if="props.editable" class="i-mdi-camera editing-indicator" />

      <view class="scrim" v-if="props.editable" />
    </Badge>
  </view>
</template>
<style lang="scss" scoped src="./avatar.scss"></style>
