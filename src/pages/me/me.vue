<script lang="ts">
import { TABBAR_PAGE_ID } from "@/data/enum";
import { syncTabBarIndex } from "@/utils/tabbar";
import { DEFAULT_ACCOUNT_WALLPAPER } from "@/data/const";
import type {
  InputOnInputEvent,
  InputOnConfirmEvent,
} from "@uni-helper/uni-app-types";

const MY_PAGE_ID = TABBAR_PAGE_ID.ME;

export default {
  name: MY_PAGE_ID,
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useTranslate } from "@/locale/use";
import { AccountBaseProfile, Account } from "@/business/account/base";
import SafeAreaInset from "@/components/common/safeAreaInset.vue";
import Avatar from "@/components/common/avatar/avatar.vue";
import Cell from "@/components/common/cell/cell.vue";
import Card from "@/components/common/card/card.vue";
import Field from "@/components/common/field/field.vue";
import { PUButton } from "@partner-up-dev/design/uniapp";
import dayjs from "dayjs";
import { useChooseImage } from "@/business/oss/index";
import { GENDER_OPTIONS, MBTI_OPTIONS } from "@/data/const";
import type { FieldValueType } from "@/components/common/field/field";

const { dt } = useTranslate("me");
const { baseProfile } = AccountBaseProfile.use();
const { chooseImageAndUpload } = useChooseImage();

// 登录状态
const isLoggedIn = computed(() => {
  return !!baseProfile.value;
});

// 计算属性
const userNickname = computed(() => {
  return baseProfile.value?.nickname || dt("user.placeholder_nickname");
});

const userAvatar = computed(() => {
  return baseProfile.value?.avatar || undefined;
});

const userWallpaper = computed((): string => {
  return baseProfile.value?.wallpaper || DEFAULT_ACCOUNT_WALLPAPER;
});

const joinedDate = computed(() => {
  if (!baseProfile.value?.created_at) return "";
  return dayjs(baseProfile.value.created_at).format("YYYY-MM-DD");
});

const simpleProfileStyle = computed(() => {
  return {
    height: isLoggedIn.value ? "50vh" : "22vh",
    backgroundImage:
      (isLoggedIn.value
        ? "linear-gradient(to top, var(--background-color), transparent),"
        : "") + `url(${userWallpaper.value})`,
  };
});

// Formatters for field values
const genderFormatter = (val: any) => {
  const option = GENDER_OPTIONS.find((opt) => opt.value === val);
  return option ? option.label : val;
};

const mbtiFormatter = (val: any) => {
  const option = MBTI_OPTIONS.find((opt) => opt.value === val);
  return option ? option.label : val;
};

// Add ref to track editing mode
const isEditing = ref(false);

// 方法
function onHelpClick() {
  console.log("帮助");
  // TODO: 导航到帮助页面或显示帮助信息
}

function onLoginClick() {
  console.log("登录");
  // TODO: 实现登录逻辑
  Account.login(true);
}

function onEditProfileClick() {
  // Toggle editing mode
  isEditing.value = !isEditing.value;
}

function onWallpaperEditClick() {
  chooseImageAndUpload("images", `wallpapers/${baseProfile.value?.id}`)
    .then((url) => {
      if (baseProfile.value) {
        baseProfile.value.wallpaper = url;
        baseProfile.value.put();
      }
    })
    .catch((error) => {
      console.error("壁纸上传失败:", error);
    });
}

function onNicknameInput(event: InputOnInputEvent) {
  if (!baseProfile.value) return;
  baseProfile.value.nickname = event.detail.value;
}

function onNicknameConfirm(event: InputOnConfirmEvent) {
  if (baseProfile.value) {
    baseProfile.value.nickname = event.detail.value;
    baseProfile.value.put();
  }
}

function onLogoutClick() {
  console.log("登出");
  // TODO: 实现登出逻辑
}

function onMyPartnerRequestsClick() {
  console.log("我的搭子请求");
  // TODO: 导航到我的搭子请求页面
}

function onBioConfirm(value: FieldValueType) {
  if (baseProfile.value) {
    baseProfile.value.bio = value as string;
    baseProfile.value.put();
  }
}

function onGenderConfirm(value: FieldValueType) {
  if (baseProfile.value) {
    baseProfile.value.gender = value as string;
    baseProfile.value.put();
  }
}

function onMbtiConfirm(value: FieldValueType) {
  if (baseProfile.value) {
    baseProfile.value.mbti = value as string;
    baseProfile.value.put();
  }
}

// 生命周期
onLoad(() => {
  // 页面加载时的逻辑
});

onShow(() => {
  // 页面显示时的逻辑
  syncTabBarIndex(MY_PAGE_ID);
});
</script>

<template>
  <view class="page-bg"></view>
  <view class="me-page">
    <view class="me-page__main">
      <SafeAreaInset position="top" />

      <text class="me-page__welcome" v-if="!isLoggedIn">
        {{ dt("welcome") }}
      </text>

      <view
        class="profile-metadata relative"
        :style="simpleProfileStyle"
        v-if="isLoggedIn"
      >
        <view class="absolute top-4 right-4">
          <PUButton
            v-if="isEditing"
            prefix-icon="i-mdi-image-edit-outline"
            theme="Surface"
            type="OnlyIcon"
            size="Small"
            @click="onWallpaperEditClick"
          />
        </view>

        <view class="flex flex-row justify-between items-center space-p-x-med">
          <Avatar
            :src="userAvatar"
            size="xLarge"
            radius="none"
            uploadBucket="image"
            :uploadKey="`avatars/${baseProfile?.id}`"
            :editable="isEditing"
          />

          <view class="flex flex-col items-end text-align-right">
            <text class="joined-at">
              {{ joinedDate }} {{ dt("user.joined_at") }}
            </text>
            <view class="nickname" v-if="!isEditing">
              {{ userNickname }}
            </view>

            <input
              class="nickname nickname-editor"
              v-else
              :value="userNickname"
              :maxlength="AccountBaseProfile.NICKNAME_MAX_LENGTH"
              :placeholder="dt('nickname.placeholder')"
              type="nickname"
              @confirm="onNicknameConfirm"
              @input="onNicknameInput"
            />
          </view>
        </view>
      </view>

      <view class="me-page__content">
        <Cell
          :title="dt('my_partner_requests.title')"
          :subtitle="dt('my_partner_requests.subtitle')"
          suffix-icon="i-mdi-chevron-right"
          size="medium"
          @click="onMyPartnerRequestsClick"
        />

        <view class="me-page__operations">
          <PUButton
            v-if="isLoggedIn"
            :text="dt('actions.edit_profile')"
            prefix-icon="i-mdi-pencil-outline"
            theme="Surface"
            type="WithText"
            size="Small"
            :active="isEditing"
            @click="onEditProfileClick"
          />
          <PUButton
            v-if="isLoggedIn"
            :text="dt('actions.logout')"
            prefix-icon="i-mdi-logout"
            theme="Surface"
            type="WithText"
            size="Small"
            @click="onLogoutClick"
          />
          <PUButton
            v-if="!isLoggedIn"
            :text="dt('actions.login')"
            prefix-icon="i-mdi-login"
            theme="PrimaryContainer"
            type="WithText"
            size="Small"
            @click="onLoginClick"
          />
          <PUButton
            :text="dt('actions.help')"
            prefix-icon="i-mdi-help-circle-outline"
            theme="Surface"
            :type="isLoggedIn ? 'WithText' : 'OnlyIcon'"
            size="Small"
            @click="onHelpClick"
          />
        </view>

        <!-- 编辑个人信息卡片 -->
        <view class="base-profile-form" v-if="isEditing">
          <Field
            :title="dt('edit_card.fields.bio.title')"
            :value="baseProfile?.bio || undefined"
            :value-placeholder="dt('edit_card.fields.bio.placeholder')"
            editor-type="common_input"
            size="medium"
            @confirm="onBioConfirm"
          />
          <Field
            :title="dt('edit_card.fields.gender.title')"
            :value="baseProfile?.gender || undefined"
            :value-formmater="genderFormatter"
            :value-placeholder="dt('edit_card.fields.gender.placeholder')"
            editor-type="common_picker"
            :editor-data="GENDER_OPTIONS"
            size="medium"
            @confirm="onGenderConfirm"
          />
          <Field
            :title="dt('edit_card.fields.mbti.title')"
            :value="baseProfile?.mbti || undefined"
            :value-formmater="mbtiFormatter"
            :value-placeholder="dt('edit_card.fields.mbti.placeholder')"
            editor-type="common_picker"
            :editor-data="MBTI_OPTIONS"
            size="medium"
            @confirm="onMbtiConfirm"
          />
        </view>
      </view>
    </view>

    <!-- TabBar 安全区域插入 -->
    <SafeAreaInset position="tabBar" />
    <!-- 底部安全区域插入 -->
    <SafeAreaInset position="bottom" />
  </view>
</template>

<style scoped lang="scss" src="./me.scss"></style>
