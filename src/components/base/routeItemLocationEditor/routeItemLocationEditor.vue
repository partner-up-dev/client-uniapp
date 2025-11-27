<script lang="ts">
export default {
  name: "RouteItemLocationEditor",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { useTranslate } from "@/locale/use";
import { usePickLocation } from "@/components/base/locationPicker/usePickLocation";
import { Location, type LocationRef } from "@/business/base/route";
import { useBaseLocationStore } from "@/store/base/location";
import store from "@/store";
import {
  routeItemLocationEditorProps,
  routeItemLocationEditorEmits,
  validateLocation,
  FRIENDLY_ADDRESS_MAX_LENGTH,
} from "./routeItemLocationEditor";
import Cell from "@/components/common/cell/cell.vue";
import { PUInput, PUButton } from "@partner-up-dev/design-uniapp";

const props = defineProps(routeItemLocationEditorProps);
const emit = defineEmits(routeItemLocationEditorEmits);

const { dt } = useTranslate("base.route_item_location_editor");

// ==================== State ====================

const locationStore = useBaseLocationStore(store);

// 创建一个空的 Location 对象作为初始值
function createEmptyLocation(): Location {
  return Location.parse({
    address: [],
    friendly_address: "",
    lat: 0,
    lng: 0,
  });
}

const currentLocation = ref<Location>(
  props.modelValue && locationStore.fetchById(props.modelValue)
    ? locationStore.fetchById(props.modelValue)!
    : createEmptyLocation()
);

const errorMessage = ref<string>("");
const isSaving = ref<boolean>(false);

// ==================== Computed ====================

const addressDisplay = computed(() => {
  if (
    !currentLocation.value.address ||
    currentLocation.value.address.length === 0
  ) {
    return "";
  }
  return currentLocation.value.address.join(" ");
});

const hasAddress = computed(() => {
  return addressDisplay.value.length > 0;
});

// ==================== Methods ====================

const { selectLocation } = usePickLocation((location) => {
  emit("change", location);
});

function onChooseLocationClick() {
  selectLocation(props.modelValue);
}

function onCancelClick() {
  emit("cancel");
}

async function onConfirmClick() {
  // 验证地点数据
  const validationError = validateLocation(currentLocation.value);
  if (validationError) {
    errorMessage.value = validationError;
    uni.showToast({
      title: validationError,
      icon: "none",
    });
    return;
  }

  errorMessage.value = "";
  isSaving.value = true;

  try {
    // 如果没有 _id，需要保存到服务器
    if (!currentLocation.value._id) {
      // 调用 protected put() 方法保存地点
      // @ts-ignore - accessing protected method
      await currentLocation.value.put();

      // put() 方法会更新 _id 属性
      // 等待一下让异步更新完成
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // 确保有 _id
    if (currentLocation.value._id) {
      // 保存到本地 store
      locationStore.upsert(currentLocation.value as Location);

      emit("update:modelValue", currentLocation.value._id);
      emit("confirm", currentLocation.value as Location);

      uni.showToast({
        title: dt("toast.save_success"),
        icon: "success",
      });
    } else {
      throw new Error("Failed to get location ID");
    }
  } catch (error) {
    errorMessage.value = dt("toast.save_failed");
    uni.showToast({
      title: dt("toast.save_failed"),
      icon: "none",
    });
  } finally {
    isSaving.value = false;
  }
}

/**
 * 暴露给父组件的方法：获取当前地点对象
 */
function getLocation(): Location {
  return currentLocation.value as Location;
}

/**
 * 暴露给父组件的方法：保存地点（同确认按钮功能）
 */
function save() {
  onConfirmClick();
}

// ==================== Watchers ====================

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const location = locationStore.fetchById(newValue);
      if (location) {
        currentLocation.value = location;
      } else {
        // 如果本地没有，异步加载
        Location.getById(newValue).then((location) => {
          currentLocation.value = location as Location;
        });
      }
    } else {
      // 清空当前地点
      currentLocation.value = createEmptyLocation();
    }
  }
);

// ==================== Expose ====================

defineExpose({
  getLocation,
  save,
});
</script>

<template>
  <view class="route-item-location-editor">
    <view class="route-item-location-editor__form">
      <!-- 地点名称输入框 -->
      <Cell
        :title="dt('field.friendly_address.title')"
        :subtitle="dt('field.friendly_address.subtitle')"
        type="default"
        size="small"
      >
        <template #value>
          <PUInput
            v-model="currentLocation.friendly_address"
            :placeholder="dt('field.friendly_address.placeholder')"
            :maxlength="FRIENDLY_ADDRESS_MAX_LENGTH"
            :show-word-limit="true"
            size="large"
          />
        </template>
      </Cell>

      <!-- 地址选择 -->
      <Cell
        :title="dt('field.address.title')"
        type="default"
        size="small"
        suffix-icon="i-mdi-chevron-right"
        @click="onChooseLocationClick"
      >
        <template #value>
          <text
            :class="[
              'route-item-location-editor__address-value',
              !hasAddress
                ? 'route-item-location-editor__address-value--empty'
                : '',
            ]"
          >
            {{ hasAddress ? addressDisplay : dt("field.address.placeholder") }}
          </text>
        </template>
      </Cell>
    </view>

    <!-- 错误信息 -->
    <view class="route-item-location-editor__error-message">
      {{ errorMessage }}
    </view>

    <!-- 操作按钮 -->
    <view class="route-item-location-editor__operations">
      <view class="route-item-location-editor__choose-btn">
        <PUButton
          :text="dt('button.choose_location')"
          theme="SurfaceOutlined"
          type="WithText"
          size="Medium"
          @click="onChooseLocationClick"
        />
      </view>

      <view class="route-item-location-editor__cancel-btn">
        <PUButton
          :text="dt('button.cancel')"
          theme="SurfaceOutlined"
          type="WithText"
          size="Medium"
          @click="onCancelClick"
        />
      </view>

      <view class="route-item-location-editor__confirm-btn">
        <PUButton
          :text="dt('button.confirm')"
          theme="Primary"
          type="WithText"
          size="Medium"
          :disabled="isSaving"
          :loading="isSaving"
          @click="onConfirmClick"
        />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped src="./routeItemLocationEditor.scss"></style>
