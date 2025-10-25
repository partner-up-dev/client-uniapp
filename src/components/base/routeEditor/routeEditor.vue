<script lang="ts">
export default {
  name: "RouteEditor",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { useTranslate } from "@/locale/use";
import {
  routeEditorProps,
  routeEditorEmits,
  getRouteItemType,
  isRouteItemRemovable,
  validateRoute,
  type RouteItemType,
} from "./routeEditor";
import type { RouteItem } from "@/business/base/route";
import { getTencentLBSPluginCredentialString } from "@/utils";
import { errorReport } from "@/utils/vendor";
import { EVENT } from "@/data/enum";
import RouteItemDatetimeEditor from "@/components/base/routeItemDatetimeEditor/routeItemDatetimeEditor.vue";
import RouteItemLocationEditor from "@/components/base/routeItemLocationEditor/routeItemLocationEditor.vue";
import PUButton from "@/components/common/PUButton/PUButton.vue";
import PUDrawer from "@/components/common/PUDrawer/PUDrawer.vue";

const { dt: t } = useTranslate("base.route_editor");
const props = defineProps(routeEditorProps);
const emit = defineEmits(routeEditorEmits);

// @ts-ignore - WeChat plugin
const chooseLocationPlugin = requirePlugin("chooseLocation");

// ==================== Data ====================
const datetimeEditorVisible = ref(false);
const locationEditorVisible = ref(false);
const editingItemIndex = ref<number>(-1);
const validationErrors = ref<string[]>([]);

// ==================== Computed ====================
const isNormalType = computed(() => props.type === "normal");
const isImmersiveType = computed(() => props.type === "immersive");

const departureItem = computed(() => props.modelValue.items[0]);
const arrivalItem = computed(
  () => props.modelValue.items[props.modelValue.items.length - 1]
);
const waypointItems = computed(() =>
  props.modelValue.items.slice(1, props.modelValue.items.length - 1)
);

const canAddWaypoint = computed(() => props.modelValue.items.length < props.max);

// ==================== Methods ====================
function onValueChange() {
  emit("update:modelValue", props.modelValue);
  emit("change");

  // 检查是否所有必要数据已填写（仅 immersive 模式）
  if (isImmersiveType.value) {
    const allLocationsFilled = props.modelValue.items.every(
      (item) => item.location
    );
    if (allLocationsFilled) {
      setTimeout(() => {
        emit("complete");
      }, 500);
    }
  }
}

function addWaypoint() {
  if (!canAddWaypoint.value) {
    uni.showToast({
      title: t("toast.max_waypoints_reached"),
      icon: "none",
    });
    return;
  }

  // 插入到终点之前
  props.modelValue.addWaypoint();
  onValueChange();
}

function removeWaypoint(index: number) {
  // index 是 waypointItems 的索引，需要转换为 route.items 的索引
  const actualIndex = index + 1;
  if (!isRouteItemRemovable(actualIndex, props.modelValue.items.length)) {
    return;
  }

  props.modelValue.items.splice(actualIndex, 1);
  onValueChange();
}

function openDatetimeEditor(index: number) {
  if (props.disableDatetime) return;

  // immersive 模式下，如果不使用内置编辑器，则触发外部事件
  if (isImmersiveType.value && !props.useDepDatetimeEditor && index === 0) {
    emit("edit_dep_time");
    return;
  }

  editingItemIndex.value = index;
  datetimeEditorVisible.value = true;
}

function onDatetimeEditorConfirm() {
  datetimeEditorVisible.value = false;
  onValueChange();
}

function openLocationEditor(index: number) {
  editingItemIndex.value = index;

  // 使用腾讯地图插件选择地点
  chooseLocationPlugin.setLocation(null);

  uni.$once(EVENT.ROUTE_EDITOR_PAGE_SHOWED, onLocationSelected);

  const currentItem = props.modelValue.items[index];
  let locationParam = "";

  // 如果已有地点，传入当前位置
  if (currentItem.location) {
    // 这里需要从 location store 获取坐标
    // 暂时简化处理
  }

  uni.navigateTo({
    url: `plugin://chooseLocation/index?${getTencentLBSPluginCredentialString()}${locationParam}`,
  });
}

function onLocationSelected() {
  const selectedLocation = chooseLocationPlugin.getLocation();
  if (!selectedLocation || editingItemIndex.value === -1) return;

  // 处理地址
  let address = "";
  if (typeof selectedLocation.address === "string") {
    address = selectedLocation.address
      .replace(selectedLocation.province, "")
      .replace(selectedLocation.city, "")
      .replace(selectedLocation.district, "");
  } else {
    address = selectedLocation.address.join("|");
  }

  // 创建 Location 对象并保存
  const Location = require("@/business/base/route").Location;
  const newLocation = Location.parse({
    lat: selectedLocation.latitude,
    lng: selectedLocation.longitude,
    address: [
      selectedLocation.province,
      selectedLocation.city,
      selectedLocation.district,
      address,
    ],
    friendly_address: selectedLocation.name,
  });

  // 保存到后端并更新 route item
  newLocation.put();
  if (newLocation._id) {
    props.modelValue.items[editingItemIndex.value].location = newLocation._id;
    onValueChange();
  }

  editingItemIndex.value = -1;
}

function navigateToRoutePlan() {
  if (!departureItem.value.location || !arrivalItem.value.location) {
    uni.showModal({
      title: t("toast.location_not_selected"),
      showCancel: false,
    });
    return;
  }

  if (waypointItems.value.length > 0) {
    uni.showModal({
      title: t("toast.waypoint_not_supported_in_navigation"),
      showCancel: false,
      complete: () => {
        navigateToRoutePlanPage();
      },
    });
  } else {
    navigateToRoutePlanPage();
  }
}

function navigateToRoutePlanPage() {
  // 需要获取 Location 对象来构建导航参数
  // 这里简化处理，实际需要从 store 获取
  const Location = require("@/business/base/route").Location;

  Promise.all([
    Location.get(departureItem.value.location),
    Location.get(arrivalItem.value.location),
  ])
    .then(([startLoc, endLoc]) => {
      const startPoint = JSON.stringify({
        latitude: startLoc.lat,
        longitude: startLoc.lng,
        name: startLoc.friendly_address,
      });
      const endPoint = JSON.stringify({
        latitude: endLoc.lat,
        longitude: endLoc.lng,
        name: endLoc.friendly_address,
      });

      uni.navigateTo({
        url: `plugin://routePlan/index?${getTencentLBSPluginCredentialString()}&startPoint=${startPoint}&endPoint=${endPoint}`,
      });
    })
    .catch(() => {
      errorReport(t("toast.fail_to_get_location"));
    });
}

function validate(): Promise<{ valid: boolean; errors: string[] }> {
  const result = validateRoute(props.modelValue.items, props.ruleMode);
  validationErrors.value = result.errors;
  return Promise.resolve(result);
}

function getLocationAddress(item: RouteItem, itemType: RouteItemType): string {
  // 这里需要从 location store 获取，暂时返回占位符
  if (!item.location) {
    return t(`placeholder.${itemType}`);
  }
  return ""; // 实际应该返回 location.friendly_address
}

// ==================== Watchers ====================
watch(
  () => props.modelValue.items,
  (newValue) => {
    if (newValue) {
      props.modelValue.items = newValue;
    }
  }
);

watch(
  () => props.disableDatetime,
  (disabled) => {
    props.modelValue.items.forEach((item) => {
      if (disabled) {
        item.datetime.datetime = null;
      } else if (
        !item.datetime.datetime &&
        props.modelValue.items.indexOf(item) === 0
      ) {
        // 如果是出发点且允许编辑时间但未设置，设为当前时间
        item.datetime.datetime = new Date();
      }
    });
  },
  { immediate: true }
);

// ==================== Expose ====================
defineExpose({
  validate,
});
</script>

<template>
  <!-- Normal -->
  <view v-if="isNormalType" class="route-editor route-editor--normal">
    <view class="route-editor__operations">
      <PUButton
        type="OnlyIcon"
        size="Medium"
        prefixIcon="i-mdi-map"
        @click="navigateToRoutePlan"
      />
      <PUButton
        type="OnlyIcon"
        size="Medium"
        prefixIcon="i-mdi-plus"
        @click="addWaypoint"
      />
    </view>

    <view class="route-editor__content">
      <view
        v-for="(item, index) in route.items"
        :key="`route-item-${index}`"
        class="route-item"
      >
        <view
          v-if="!disableDatetime"
          class="route-item__datetime"
          @click="openDatetimeEditor(index)"
        >
          <text>{{ item.datetime.timeRange.start || "--:--" }}</text>
          <text v-if="item.datetime.bring_ahead || item.datetime.put_off">
            ±{{ item.datetime.bring_ahead || item.datetime.put_off }}min
          </text>
        </view>

        <view class="route-item__main">
          <view class="route-item__location" @click="openLocationEditor(index)">
            <text>{{
              getLocationAddress(
                item,
                getRouteItemType(index, route.items.length)
              )
            }}</text>
          </view>

          <PUButton
            v-if="!disableDatetime"
            type="OnlyIcon"
            size="Small"
            prefixIcon="i-mdi-clock"
            @click="openDatetimeEditor(index)"
          />

          <PUButton
            v-if="isRouteItemRemovable(index, route.items.length)"
            type="OnlyIcon"
            size="Small"
            prefixIcon="i-mdi-close"
            @click="removeWaypoint(index - 1)"
          />
        </view>
      </view>
    </view>

    <view v-if="validationErrors.length > 0" class="route-editor__errors">
      <text
        v-for="(error, index) in validationErrors"
        :key="index"
        class="error-item"
      >
        {{ error }}
      </text>
    </view>
  </view>

  <!-- Immersive -->
  <view v-else-if="isImmersiveType" class="route-editor route-editor--immersive">
    <view class="form">
      <!-- Departure -->
      <view class="route-item route-item--departure">
        <view class="route-item__title">{{
          t("immersive.departure.title")
        }}</view>
        <view class="route-item__content">
          <text class="route-item__location" @click="openLocationEditor(0)">
            {{ getLocationAddress(departureItem, "departure") }}
          </text>
          <text class="route-item__text">{{
            t("immersive.departure.text")
          }}</text>
          <text
            v-if="!disableDatetime"
            class="route-item__action i-mdi-clock"
            @click="openDatetimeEditor(0)"
          />
        </view>
      </view>

      <!-- Waypoints -->
      <view
        v-for="(item, index) in waypointItems"
        :key="`waypoint-${index}`"
        class="route-item route-item--waypoint"
      >
        <text class="route-item__title">{{ t("immersive.waypoint.title") }}</text>
        <view class="route-item__content">
          <text
            class="route-item__location"
            @click="openLocationEditor(index + 1)"
          >
            {{ getLocationAddress(item, "waypoint") }}
          </text>
          <text
            class="route-item__action i-mdi-minus-circle"
            @click="removeWaypoint(index)"
          />
        </view>
      </view>

      <!-- Arrival -->
      <view class="route-item route-item--arrival">
        <text class="route-item__title">{{ t("immersive.arrival.title") }}</text>
        <view class="route-item__content">
          <text
            class="route-item__location"
            @click="openLocationEditor(modelValue.items.length - 1)"
          >
            {{ getLocationAddress(arrivalItem, "arrival") }}
          </text>
        </view>
      </view>
    </view>

    <view class="operations">
      <PUButton text="导航" theme="Surface" @click="navigateToRoutePlan" />
      <PUButton text="添加途经点" theme="Tertiary" @click="addWaypoint" />
    </view>
  </view>

  <!-- Datetime Editor Drawer -->
  <PUDrawer
    v-model:visible="datetimeEditorVisible"
    title="编辑时间"
    :full-custom="true"
  >
    <template #full>
      <RouteItemDatetimeEditor
        v-if="editingItemIndex >= 0 && editingItemIndex < modelValue.items.length"
        :modelValue="modelValue.items[editingItemIndex].datetime"
        @confirm="onDatetimeEditorConfirm"
        @cancel="datetimeEditorVisible = false"
      />
    </template>
  </PUDrawer>
</template>

<style lang="scss" scoped src="./routeEditor.scss"></style>
