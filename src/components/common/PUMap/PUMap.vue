<template>
  <view class="pu-map" :style="{ height }">
    <!-- UniApp地图组件 -->
    <map
      :id="mapId"
      ref="mapRef"
      class="map-view"
      :latitude="currentCenter?.latitude"
      :longitude="currentCenter?.longitude"
      :markers="markers"
      :polyline="polylines"
      :show-location="showLocation"
      :enable-3d="enable3d"
      :show-compass="showCompass"
      :show-scale="showScale"
      :enable-scroll="enableScroll"
      :enable-zoom="enableZoom"
      @markertap="onMarkerClick"
      @tap="onMapClick"
    />

    <!-- 地图操作按钮 -->
    <view class="operations">
      <slot>
        <view class="pu-map-operation" v-if="showResetBtn" @tap="onReset">
          <text class="i-mdi-crosshairs-gps"></text>
        </view>
      </slot>
    </view>
  </view>
</template>

<script lang="ts">
export default {
  name: "PUMap",
  options: BasicComponentOptions,
};
</script>

<script setup lang="ts">
import {
  computed,
  type ComputedRef,
  getCurrentInstance,
  onMounted,
  ref,
  watch,
} from "vue";
import { BasicComponentOptions } from "@/utils/vue";
import { useOptionalVModel } from "@/composables/props";
import {
  puMapProps,
  puMapEmits,
  type GeoElementWithIndex,
  getUserLocation,
  DEFAULT_MARKER_ICONS,
  DEFAULT_POLYLINE_STYLE,
  colorWithAlpha,
} from "./PUMap";
import {
  type Coord,
  RoutePlanning,
  Route,
  RoutePlan,
} from "@/business/base/route";
import type { MapMarker, MapPolyline } from "@uni-helper/uni-app-types";

// Props & Emits
const props = defineProps(puMapProps);
const emit = defineEmits(puMapEmits);

const mapRef = ref<UniNamespace.MapContext>();

// v-model:activeElement (optional)
const activeElement = useOptionalVModel<GeoElementWithIndex | null | undefined>({
  props,
  emit,
  modelName: "activeElement",
});

/**
 * 创建 GeoElementWithIndex 对象
 */
function createGeoElementWithIndex(elementIndex: number): GeoElementWithIndex {
  return {
    value: props.elements[elementIndex],
    index: elementIndex,
  };
}

const routesPlans = computed((): ComputedRef<RoutePlan[] | undefined>[] => {
  return props.elements
    .filter((element) => element instanceof Route)
    .map((element) => {
      const routeRef = computed(() => element);
      const { plans } = RoutePlanning.use(routeRef);
      return plans;
    });
});

const markers = computed((): MapMarker[] => {
  const allMarkers: MapMarker[] = [];
  let markerIdCounter = 0;
  let routePlanIndex = 0;

  routesPlans.value.forEach((routePlans, index) => {
    if (!routePlans.value || routePlans.value.length === 0) {
      return;
    }

    // Use the first planning result for each route
    const plan = routePlans.value[0];
    const isActiveElement = index === activeElement.value?.index;
    const alpha = isActiveElement ? 1.0 : 0.7;

    // Start point: first point of polyline
    if (plan.polyline.length > 0) {
      const startPoint = plan.polyline[0];
      allMarkers.push({
        id: markerIdCounter++,
        latitude: startPoint.latitude,
        longitude: startPoint.longitude,
        iconPath: DEFAULT_MARKER_ICONS.start,
        width: 24,
        height: 24,
        alpha: alpha,
        anchor: { x: 0.5, y: 1.0 },
      });
    }

    // Waypoints: from plan.waypoints
    plan.waypoints?.forEach((waypoint, index) => {
      allMarkers.push({
        id: markerIdCounter++,
        latitude: waypoint.lat,
        longitude: waypoint.lng,
        iconPath: DEFAULT_MARKER_ICONS.waypoint,
        width: 24,
        height: 24,
        alpha: alpha,
        anchor: { x: 0.5, y: 1.0 },
      });
    });

    // End point: last point of polyline
    if (plan.polyline.length > 1) {
      const endPoint = plan.polyline[plan.polyline.length - 1];
      allMarkers.push({
        id: markerIdCounter++,
        latitude: endPoint.latitude,
        longitude: endPoint.longitude,
        iconPath: DEFAULT_MARKER_ICONS.end,
        width: 24,
        height: 24,
        alpha: alpha,
        anchor: { x: 0.5, y: 1.0 },
      });
    }

    routePlanIndex++;
  });

  return allMarkers;
});

const polylines = computed((): MapPolyline[] => {
  const allPolylines: MapPolyline[] = [];

  // from route
  routesPlans.value.forEach((routePlans, index) => {
    if (!routePlans.value || routePlans.value.length === 0) {
      return;
    }
    const plan = routePlans.value[0];
    const isActiveElement = index === activeElement.value?.index;
    const alpha = isActiveElement ? 1.0 : 0.7;

    allPolylines.push({
      points: plan.polyline,
      color: colorWithAlpha(DEFAULT_POLYLINE_STYLE.color, alpha),
      width: DEFAULT_POLYLINE_STYLE.width,
      borderColor: colorWithAlpha(DEFAULT_POLYLINE_STYLE.borderColor, alpha),
      borderWidth: DEFAULT_POLYLINE_STYLE.borderWidth,
      arrowLine: true,
    });
  });

  return allPolylines;
});

// Computed properties
const currentCenter = computed((): Coord | undefined => {
  if (activeElement.value) {
    return undefined;
  }
  if (!props.center) {
    getUserLocation().then((location) => {
      emit("update:center", location);
    });
  }
  return props.center;
});

watch(
  () => [props.elements.length, activeElement.value] as const,
  ([len, current]) => {
    if (current === undefined && len > 0) {
      activeElement.value = createGeoElementWithIndex(0);
    }
  },
  { immediate: true }
);

// Methods

/**
 * 将当前激活元素（activeElement）对应的路线包含到地图视野
 * - 只在 activeElement 存在、且有对应的 polyline 时生效
 */
function moveActiveElementIntoView() {
  const _activeElement = activeElement.value;
  const currentPolylines = polylines.value;

  const hasActive = _activeElement != null && _activeElement.index >= 0;
  const hasPolylines = currentPolylines.length > 0;
  if (!hasActive || !hasPolylines) return;

  // 找到激活元素对应的 polyline 索引（仅计算 Route 类型）
  let polylineIndex = -1;
  let routeElementCount = 0;
  for (let i = 0; i < props.elements.length; i++) {
    if (props.elements[i] instanceof Route) {
      const isActive = i === _activeElement.index;
      if (isActive) {
        polylineIndex = routeElementCount;
        break;
      }
      routeElementCount++;
    }
  }

  const isValidIndex =
    polylineIndex >= 0 && polylineIndex < currentPolylines.length;
  if (!isValidIndex) return;

  const activeRoutePoints = currentPolylines[polylineIndex].points;
  const hasPoints =
    Array.isArray(activeRoutePoints) && activeRoutePoints.length > 0;
  if (!hasPoints) return;

  mapRef.value?.includePoints({
    points: activeRoutePoints,
    padding: [25, 50, 25, 50], // FIXME 假设了长宽比
  });
}

/**
 * 标记点击事件处理
 */
function onMarkerClick(event: any) {
  console.log("Marker clicked:", event);
  const markerId = event.detail?.markerId || event.markerId;
  const marker = markers.value.find((m: MapMarker) => m.id === markerId);

  if (marker) {
    // 根据marker ID确定对应的元素索引
    let elementIndex = -1;
    let markerIdCounter = 0;
    let routePlanIndex = 0;

    // 是否为路线的Marker
    for (let i = 0; i < props.elements.length; i++) {
      const element = props.elements[i];

      // 只处理Route类型的元素
      if (!(element instanceof Route)) {
        continue;
      }

      const routePlans = routesPlans.value[routePlanIndex];
      if (!routePlans.value || routePlans.value.length === 0) {
        routePlanIndex++;
        continue;
      }

      const plan = routePlans.value[0];

      // 检查是否是起点
      if (plan.polyline.length > 0) {
        if (markerIdCounter === markerId) {
          elementIndex = i;
          break;
        }
        markerIdCounter++;
      }

      // 检查是否是途经点
      if (plan.waypoints) {
        for (let j = 0; j < plan.waypoints.length; j++) {
          if (markerIdCounter === markerId) {
            elementIndex = i;
            break;
          }
          markerIdCounter++;
        }
        if (elementIndex !== -1) break;
      }

      // 检查是否是终点
      if (plan.polyline.length > 1) {
        if (markerIdCounter === markerId) {
          elementIndex = i;
          break;
        }
        markerIdCounter++;
      }

      routePlanIndex++;
    }

    // 如果找到了对应的元素，激活它
    if (elementIndex !== -1) {
      activeElement.value = createGeoElementWithIndex(elementIndex);
    }
  }
}

/**
 * 地图点击事件处理（用于检测polyline点击）
 */
function onMapClick(event: any) {
  console.log("Map clicked:", event);

  // 获取点击的经纬度
  const clickedCoord = event.detail;
  if (!clickedCoord || !clickedCoord.latitude || !clickedCoord.longitude) {
    return;
  }

  // 检查点击位置是否属于某个路线的polyline
  let clickedElementIndex = -1;
  const CLICK_THRESHOLD = 0.005;
  routesPlans.value.forEach((routePlans, index) => {
    if (!routePlans.value || routePlans.value.length === 0) {
      return;
    }

    // 使用第一个规划结果
    const plan = routePlans.value[0];

    // 检查点击的坐标是否在polyline附近
    const isOnPolyline = plan.polyline.some((coord: Coord) => {
      const latDiff = Math.abs(coord.latitude - clickedCoord.latitude);
      const lngDiff = Math.abs(coord.longitude - clickedCoord.longitude);
      return latDiff <= CLICK_THRESHOLD && lngDiff <= CLICK_THRESHOLD;
    });

    if (isOnPolyline && clickedElementIndex === -1) {
      clickedElementIndex = index;
    }
  });

  // 如果点击了路线的polyline
  if (clickedElementIndex >= 0) {
    console.log("Polyline clicked:", clickedElementIndex);

    activeElement.value = createGeoElementWithIndex(clickedElementIndex);
  }
}

function onReset() {
  moveActiveElementIntoView();
}

watch(currentCenter, (newVal) => {
  if (!newVal) return;
  mapRef.value?.moveToLocation({
    latitude: newVal.latitude,
    longitude: newVal.longitude,
    fail() {
      // errorReport(domain_t('toast.fail_to_move_to_location')); TODO
    },
  });
});

// Watch polylines changes to adjust map view
watch(
  [polylines, activeElement],
  () => {
    moveActiveElementIntoView();
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  console.log("PUMap mounted");

  // 获取地图上下文
  const componentInstance = getCurrentInstance();
  if (componentInstance) {
    mapRef.value = uni.createMapContext(props.mapId, componentInstance);
  } else {
    console.error("Failed to obtain map context");
  }
});
</script>

<style lang="scss" scoped src="./PUMap.scss"></style>
<style lang="scss">
@use "@/styles/main.scss" as *;

.pu-map-operation {
  width: 32px;
  height: 32px;
  background-color: $pu-color-surface-container;
  border-radius: $pu-radius-xs;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $pu-shadow-1;
  color: $pu-color-on-surface;

  @include pu-font-size("body-large");

  &:active {
    background-color: $pu-color-neutral-container;
  }
}
</style>
