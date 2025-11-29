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
import { useOptionalVModel } from "@/composables/props";
import { Location, Route, RouteForm, RouteItemForm } from "@/business/base/route";
import {
  routeEditorProps,
  routeEditorEmits,
  getRouteItemType,
  isRouteItemRemovable,
  validateRoute,
  type RouteItemType,
} from "./routeEditor";
import { getTencentLBSPluginCredentialString } from "@/utils";
import { errorReport } from "@/utils/vendor";
import { usePickLocation } from "@/components/base/locationPicker/usePickLocation";
import RouteItemDatetimeEditor from "@/components/base/routeItemDatetimeEditor/routeItemDatetimeEditor.vue";
import { PUButton, PUDrawer } from "@partner-up-dev/design-uniapp";

const { dt: t } = useTranslate("base.route_editor");
const props = defineProps(routeEditorProps);
const emit = defineEmits(routeEditorEmits);

// Use useOptionalVModel to handle undefined modelValue
const route = useOptionalVModel({
  props,
  emit,
  modelName: "modelValue",
  defaultValue: new RouteForm(undefined),
});

// ==================== Data ====================
const datetimeEditorVisible = ref(false);
const editingItemIndex = ref<number>(-1);

// ==================== Location Picker ====================
const { selectLocation } = usePickLocation((location) => {
  if (editingItemIndex.value === -1) return;

  // Update the route item with the selected location
  route.value[editingItemIndex.value].location = location._id;
  onValueChange();
  editingItemIndex.value = -1;
});

// ==================== Computed ====================
const isNormalType = computed(() => props.type === "normal");
const isImmersiveType = computed(() => props.type === "immersive");

const departureItem = computed(() => route.value[0]);
const arrivalItem = computed(() => route.value[route.value.length - 1]);
const waypointItems = computed(() =>
  route.value.slice(1, route.value.length - 1)
);

const canAddWaypoint = computed(() => route.value.length < props.max);

// Create location composables for each route item
const routeLocations = computed(() => {
  return route.value.map((item) => {
    const { location } = Location.use(item.location);
    return location;
  });
});

// ==================== Methods ====================
function onValueChange() {
  emit("change");

  // 检查是否所有必要数据已填写（仅 immersive 模式）
  if (isImmersiveType.value) {
    const allLocationsFilled = route.value.every((item) => item.location);
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
  route.value.splice(route.value.length - 1, 0, new RouteItemForm({}));
  onValueChange();
}

function removeWaypoint(index: number) {
  // index 是 waypointItems 的索引，需要转换为 route.items 的索引
  const actualIndex = index + 1;
  if (!isRouteItemRemovable(actualIndex, route.value.length)) {
    return;
  }

  route.value.splice(actualIndex, 1);
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
  const currentItem = route.value[index];

  // Use usePickLocation to handle location selection
  selectLocation(currentItem.location);
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
  Promise.all([
    Location.getById(departureItem.value.location!),
    Location.getById(arrivalItem.value.location!),
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

function getLocationAddress(index: number, itemType: RouteItemType): string {
  const item = route.value[index];
  if (!item?.location) {
    return t(`placeholder.${itemType}`);
  }

  const location = routeLocations.value[index];
  return location?.value?.friendly_address || t(`placeholder.${itemType}`);
}

// ==================== Watchers ====================
watch(
  () => props.disableDatetime,
  (disabled) => {
    route.value.forEach((item) => {
      if (disabled) {
        item.datetime.datetime = null;
      } else if (!item.datetime.datetime && route.value.indexOf(item) === 0) {
        // 如果是出发点且允许编辑时间但未设置，设为当前时间
        item.datetime.datetime = new Date();
      }
    });
  },
  { immediate: true }
);
</script>

<template>
  <!-- Normal -->
  <view v-if="isNormalType" class="route-editor route-editor--normal">
    <view class="operations">
      <PUButton
        type="OnlyIcon"
        theme="Plain"
        size="Small"
        prefixIcon="i-mdi-map"
        @click="navigateToRoutePlan"
      />
      <PUButton
        type="OnlyIcon"
        theme="Plain"
        size="Small"
        prefixIcon="i-mdi-plus"
        @click="addWaypoint"
      />
    </view>

    <view class="content">
      <view
        v-for="(item, index) in route"
        :key="`route-item-${index}`"
        class="route-item-wrapper"
      >
        <view class="route-item">
          <text class="route-item__location" @click="openLocationEditor(index)">
            {{ getLocationAddress(index, getRouteItemType(index, route.length)) }}
          </text>

          <PUButton
            v-if="!disableDatetime"
            type="OnlyIcon"
            theme="Plain"
            prefixIcon="i-mdi-clock"
            size="xSmall"
            @click.stop="openDatetimeEditor(index)"
          />
        </view>

        <PUButton
          v-if="isRouteItemRemovable(index, route.length)"
          type="OnlyIcon"
          theme="Plain"
          size="xSmall"
          prefixIcon="i-mdi-minus-circle"
          @click="removeWaypoint(index - 1)"
        />
      </view>
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
            {{ getLocationAddress(0, "departure") }}
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
            {{ getLocationAddress(index + 1, "waypoint") }}
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
            @click="openLocationEditor(route.length - 1)"
          >
            {{ getLocationAddress(route.length - 1, "arrival") }}
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
    height="50vh"
  >
    <template #full>
      <RouteItemDatetimeEditor
        v-if="editingItemIndex >= 0 && editingItemIndex < route.length"
        :modelValue="(route[editingItemIndex].datetime as any)"
        @confirm="onDatetimeEditorConfirm"
        @cancel="datetimeEditorVisible = false"
      />
    </template>
  </PUDrawer>
</template>

<style lang="scss" scoped src="./routeEditor.scss"></style>
