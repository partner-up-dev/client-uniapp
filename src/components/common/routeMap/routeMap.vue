<script lang="ts">
/**
 * @name 路线地图组件
 * @docs https://git.hadream.ltd/anana/application/uniapp/-/wikis/Base/RouteMap
 */
export default {
  name: "routeMap",
  options: {
    ...BasicComponentOptions,
  },
};
</script>

<script setup lang="ts">
import type { Marker, Polyline } from "./types";
import type { QQMapDirectionResult, QQMapRouteUnion } from "@/utils/lbs/types";
import type { Coord, DriverLocation } from "@/types/partner_request/trip";
import { QQMapSDK, decompressPolyline } from "@/utils/lbs/index.js";
import { errorReport, formateTimestamp, getMenuButtonPosition } from "@/utils";
import log from "@/utils/log";
import {
  computed,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import {
  RouteMapEmits,
  RouteMapProps,
  ROUTE_MARKER_SIZE,
  CAR_MARKER_ID,
  CAR_MARKER_SIZE,
  POLYLINE_COLOR,
  POLYLINE_BORDER_COLOR,
  INCLUDE_POINTS_PADDING_DEFAULT,
  CAR_AUTOPLAY_SPEED,
  CAR_OFF_TRACT_THRESHOLD,
  MARKER_ANCHOR,
  CAR_ROTATE_THRESHOLD,
  POLYLINE_WIDTH,
} from "./types";
import { BasicComponentOptions } from "@/utils/vue";
import { locationToCoordStr } from "@/store/base/location";
import { useBaseRoute } from "../useRoute";
import { useI18n } from "vue-i18n";
import { localMessages } from "./routeMap";

const { t: lt } = useI18n({ inheritLocale: true, messages: localMessages });

const props = defineProps(RouteMapProps);
const emit = defineEmits(RouteMapEmits);

// composables
const { route, departureLoc, waypointLocs, arrivalLoc, locFromIndex } =
  useBaseRoute();

// data
const planning_result = ref<QQMapRouteUnion<typeof props.planMode>[]>([]);
/** 主要（被选中的）多段线下标；（相对于polylines�?*/
const primary_polyline_index = ref(0);
/** 是否正在线路规划 */
const is_planning = ref(false);
/** 地图对象 */
const map_ref = ref<UniNamespace.MapContext>();
/** 用户位置；在需要的时候再获取 */
const user_location = ref<Coord>();
/** 暂停惯性跑�?*/
const pause_car_auto_playing = ref(false);
/** 车辆历史轨迹�?*/
const car_history_points = ref<Coord[]>([]);
/** 上一个汽车标记目的点 */
const last_destination = ref<Coord>();

// 车辆自动跑动
/** 车辆标记�?*/
const car_marker = ref<Marker | null>(null);
/** 车辆自动跑动历史轨迹�?*/
const car_autoplay_points = ref<Coord[]>([]);
/** 车辆跑动循环的id */
const car_autoplay_timeout_id = ref<number>(0);
/** 车辆自动跑动的目标点在primary_polyline的索�?*/
const car_autoplay_target_coord_index = ref(0);
/** carPosition在主要多段线上最近的�?*/
const cur_car_stciked = ref<Coord>();

// methods
/**
 * @name 获取用户当前位置
 * @description
 * 保存到user_location
 */
function getUserLocation(cb: () => void = () => undefined) {
  uni.getLocation({
    type: "gcj02",
    success(res) {
      user_location.value = {
        latitude: res.latitude,
        longitude: res.longitude,
      };
      cb();
    },
  });
}
/**
 * @name 处理气泡点击事件
 */
function onMarkerCalloutTap(e: { detail: { markerId: number } }) {
  emit("callout_tap", e.detail.markerId);
}

/**
 * @name 线路规划
 * @description
 * 调用LBS的路线规划能力，基于路线信息规划出合适的行驶路径
 */
function plan() {
  is_planning.value = true;
  planning_result.value = [];

  const waypoints_string: string = waypointLocs.value
    .map((location) => {
      return locationToCoordStr(location);
    })
    .join(";");

  QQMapSDK.direction({
    mode: props.planMode,
    from: locationToCoordStr(departureLoc.value),
    waypoints: waypoints_string,
    to: locationToCoordStr(arrivalLoc.value),
    success: (res: QQMapDirectionResult<typeof props.planMode>) => {
      if (res.status === 0) {
        planning_result.value = res.result.routes;
        is_planning.value = false;
      } else {
        errorReport(lt("toast.fail_to_plan"));
      }
    },
    fail: (errors: any) => {
      log.error(errors);
      errorReport(lt("toast.fail_to_plan"));
    },
  });
}
/**
 * @name 重置车辆历史轨迹�?
 */
function resetCarHistory() {
  car_history_points.value = [];
}
/**
 * @name 车辆惯性跑�?
 */
function autoplayCar() {
  if (pause_car_auto_playing.value) {
    return;
  }

  // 计算目标�?
  const primary_polyline_points =
    polylines.value[primary_polyline_index.value].points;
  const target_coord =
    primary_polyline_points[car_autoplay_target_coord_index.value];
  const current_coord = {
    latitude: car_marker.value?.latitude || 0,
    longitude: car_marker.value?.longitude || 0,
  };

  // 计算车头方向；正北为0度，顺时针旋�?
  const heading =
    (Math.atan2(
      target_coord.latitude - current_coord.latitude,
      target_coord.longitude - current_coord.longitude,
    ) *
      180) /
    Math.PI;
  // car_marker_heading.value = heading;

  map_ref.value?.translateMarker({
    markerId: CAR_MARKER_ID,
    autoRotate: false,
    moveWithRotate: false,
    rotate: heading,
    duration: 1000,
    destination: target_coord,
    success() {
      // record history points
      car_autoplay_points.value.push(target_coord);
      // 跑动结束，更新目标点
      car_autoplay_target_coord_index.value += CAR_AUTOPLAY_SPEED;

      if (
        car_autoplay_target_coord_index.value < primary_polyline_points.length
      ) {
        // 继续
        car_autoplay_timeout_id.value = setTimeout(autoplayCar, 1000);
      } else if (
        car_autoplay_target_coord_index.value ===
        primary_polyline_points.length - 1
      ) {
        // 跑完最后一�?
        car_autoplay_timeout_id.value = setTimeout(autoplayCar, 1000);
      } else {
        // 结束
        clearTimeout(car_autoplay_timeout_id.value);
      }
    },
    fail() {
      car_autoplay_timeout_id.value = setTimeout(autoplayCar, 1000);
    },
  });
}
/**
 * @name 开始车辆惯性跑�?
 * @description
 * 确保已经创建车标
 */
function startAutoplayCar() {
  // 计算初始目标点（车辆位置在当前多段线所有点中最接近的点 + CAR_AUTOPLAY_SPEED个坐标点�?
  const primary_polyline_points =
    polylines.value[primary_polyline_index.value].points;
  const car_position = props.carPosition;
  if (car_position) {
    // 计算距离差�?
    const distance_diffs = primary_polyline_points.map((point, index) => {
      return {
        diff: Math.sqrt(
          Math.pow(point.latitude - car_position.lat, 2) +
            Math.pow(point.longitude - car_position.lng, 2),
        ),
        index,
      };
    });
    // 排序，取最小�?
    distance_diffs.sort((a, b) => a.diff - b.diff);
    car_autoplay_target_coord_index.value =
      distance_diffs[0].index + CAR_AUTOPLAY_SPEED;
    cur_car_stciked.value = primary_polyline_points[distance_diffs[0].index];

    // 超出路线，直接移动到最�?
    if (car_autoplay_target_coord_index.value >= primary_polyline_points.length) {
      // to last
      car_autoplay_target_coord_index.value = primary_polyline_points.length - 1;
    }
  } else {
    car_autoplay_target_coord_index.value = primary_polyline_points.length - 1;
  }

  // 重置历史记录
  car_autoplay_points.value = [
    {
      latitude: car_position?.lat || 0,
      longitude: car_position?.lng || 0,
    },
  ];

  // 避免忘记关闭pause_car_auto_playing
  pause_car_auto_playing.value = false;

  // 跑动
  autoplayCar();
}
/**
 * @name 传入的位置是否偏移路�?
 * @description
 * 计算coord与primary_polyline最近的一个点的距离，如果超过阈值，则认为偏�?
 */
function isOffTrack(coord: Coord) {
  const primary_polyline = polylines.value[primary_polyline_index.value];
  if (primary_polyline) {
    const primary_polyline_points = primary_polyline.points;
    const distance_diffs = primary_polyline_points.map((point, index) => {
      const R = 6371e3; // Earth's radius in meters
      const φ1 = (coord.latitude * Math.PI) / 180;
      const φ2 = (point.latitude * Math.PI) / 180;
      const Δφ = ((point.latitude - coord.latitude) * Math.PI) / 180;
      const Δλ = ((point.longitude - coord.longitude) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return {
        diff: R * c, // distance in meters
        index,
      };
    });
    distance_diffs.sort((a, b) => a.diff - b.diff);
    cur_car_stciked.value = primary_polyline_points[distance_diffs[0].index];

    return distance_diffs[0].diff > CAR_OFF_TRACT_THRESHOLD;
  } else {
    cur_car_stciked.value = undefined;
    return false;
  }
}
/**
 * @name 记录历史轨迹
 * @description
 * 在移动完毕之后再记录
 */
function recordCarPositionHistory(newVal: DriverLocation) {
  // 记录车辆历史轨迹
  const is_off_track = isOffTrack({
    latitude: newVal.lat,
    longitude: newVal.lng,
  });
  if (!props.stickCarToPolyline || (props.stickCarToPolyline && is_off_track)) {
    // 如果没有开启贴线移动，或者发生了偏移，则记录实际值进入历史记�?
    car_history_points.value.push({
      latitude: newVal.lat,
      longitude: newVal.lng,
    });
  } else {
    // 如果开启了，则记录贴线�?
    if (cur_car_stciked.value) {
      car_history_points.value.push(cur_car_stciked.value);
    } else {
      car_autoplay_points.value.push({
        latitude: newVal.lat,
        longitude: newVal.lng,
      });
    }
  }
}
/**
 * @name 计算两点间的指向
 */
function calculateHeading(from: Coord, to: Coord) {
  let heading =
    (Math.atan2(to.longitude - from.longitude, to.latitude - from.latitude) *
      180) /
    Math.PI;

  // Convert to 0-360° range (clockwise from North)
  heading = 90 - heading;
  if (heading < 0) heading += 360;

  return heading;
}

// computed
/**
 * @name 路线标记�?
 */
const routeMarkers = computed((): Marker[] => {
  const result: Marker[] = [];

  let departure: { lat: number; lng: number };
  let arrival: { lat: number; lng: number };
  let waypoints: { lat: number; lng: number }[] = [];
  if (!planning_result.value.length) {
    // by route info
    departure = departureLoc.value;
    arrival = arrivalLoc.value;
    waypoints = waypointLocs.value;
  } else {
    // by plan result
    const primary_polyline_points =
      polylines.value[primary_polyline_index.value].points;
    departure = {
      lat: primary_polyline_points[0].latitude,
      lng: primary_polyline_points[0].longitude,
    };
    arrival = {
      lat: primary_polyline_points[primary_polyline_points.length - 1].latitude,
      lng: primary_polyline_points[primary_polyline_points.length - 1].longitude,
    };
    waypoints = (
      planning_result.value[primary_polyline_index.value].waypoints || []
    ).map((waypoint) => {
      return {
        lat: waypoint.location.lat,
        lng: waypoint.location.lng,
      };
    });
  }

  // [departure]
  result.push({
    id: 0,
    latitude: departure.lat,
    longitude: departure.lng,
    title: lt("marker.from"),
    iconPath: "/static/icon/map-marker-from.png",
    anchor: MARKER_ANCHOR,
    customCallout: props.showCallout
      ? {
          anchorX: 0,
          anchorY: 0,
          display: "ALWAYS",
        }
      : undefined,
    ...ROUTE_MARKER_SIZE,
  });
  // waypoints
  result.push(
    ...waypoints.map((waypoint, index) => {
      return {
        id: index + 1,
        latitude: waypoint.lat,
        longitude: waypoint.lng,
        title: lt("marker.waypoint", { index: index + 1 }),
        iconPath: "/static/icon/map-marker-waypoint.png",
        anchor: MARKER_ANCHOR,
        customCallout: props.showCallout
          ? {
              anchorX: 0,
              anchorY: 0,
              display: "ALWAYS",
            }
          : undefined,
        ...ROUTE_MARKER_SIZE,
      };
    }),
  );
  // [arrival]
  result.push({
    id: props.route.length - 1,
    latitude: arrival.lat,
    longitude: arrival.lng,
    title: lt("marker.to"),
    iconPath: "/static/icon/map-marker-to.png",
    anchor: MARKER_ANCHOR,
    customCallout: props.showCallout
      ? {
          anchorX: 0,
          anchorY: 0,
          display: "ALWAYS",
        }
      : undefined,
    ...ROUTE_MARKER_SIZE,
  });

  return result;
});
/**
 * @name 渲染到地图上的标记点
 */
const markers = computed((): Marker[] => {
  return [car_marker.value, ...routeMarkers.value].filter(
    (marker) => marker !== null,
  );
});
/**
 * @name 汽车历史轨迹多段�?
 * @description
 * 仅当 `showCarHistory` �?`true` 时才返回有效�?
 *
 * 只有开启自动跑动，才加载自动跑动的历史轨迹
 */
const carHistoryPolyline = computed((): Polyline | null => {
  const points = [
    ...(props.carAutoplay ? car_autoplay_points.value : car_history_points.value),
  ];

  return props.showCarHistory && points.length >= 2
    ? {
        arrowLine: true,
        points,
        width: POLYLINE_WIDTH,
        borderWidth: 1,
        color: POLYLINE_COLOR["invalid"],
        borderColor: POLYLINE_BORDER_COLOR["invalid"],
      }
    : null;
});
/**
 * @name 线路规划的多段线
 * @description
 * 样式�?
 * - 根据 `primary_polyline_index` 确定哪条是主要多段线
 *   - planningPolylines不可能和customPolyline同时渲染，所以可以等�?
 */
const planningPolylines = computed((): Polyline[] => {
  return planning_result.value.map((path, index) => {
    const is_primary = index === primary_polyline_index.value;

    return {
      arrowLine: true,
      points: decompressPolyline(path.polyline),
      width: POLYLINE_WIDTH,
      borderWidth: 1,
      color: POLYLINE_COLOR[is_primary ? "primary" : "secondary"],
      borderColor: POLYLINE_BORDER_COLOR[is_primary ? "primary" : "secondary"],
    };
  });
});
/**
 * @name 自定义的多段�?
 */
const customPolyline = computed((): Polyline | null => {
  return props.customPolylinePoints
    ? {
        arrowLine: true,
        points: props.customPolylinePoints,
        width: POLYLINE_WIDTH,
        borderWidth: 1,
        color: POLYLINE_COLOR["primary"],
        borderColor: POLYLINE_BORDER_COLOR["primary"],
      }
    : null;
});
/**
 * @name 渲染到地图上的多段线
 */
const polylines = computed((): Polyline[] => {
  const result: Polyline[] = [];
  primary_polyline_index.value = 0;

  if (customPolyline.value) {
    result.push(customPolyline.value);
  } else {
    result.push(...planningPolylines.value);
  }
  if (carHistoryPolyline.value) {
    result.push(carHistoryPolyline.value);
  }
  return result;
});
/**
 * @name 地图中心�?
 * @description
 * 根据centneMode来确�?
 *
 * 未配置或配置无效则返回null
 */
const centerPoint = computed((): Coord | null => {
  if (props.centerMode === 100) {
    getUserLocation();
    if (user_location.value) return user_location.value;
  } else if (props.centerMode === 99) {
    return {
      latitude: Math.abs(departureLoc.value.lat + arrivalLoc.value.lat) / 2,
      longitude: Math.abs(departureLoc.value.lng + arrivalLoc.value.lng) / 2,
    };
  } else if (props.centerMode === 98) {
    if (props.carPosition)
      return {
        latitude: props.carPosition.lat,
        longitude: props.carPosition.lng,
      };
  }
  // 应该再添加一个主要多段线的中心点
  else {
    const location = locFromIndex(props.centerMode);
    return {
      latitude: location.lat,
      longitude: location.lng,
    };
  }
  // fallback
  return null;
});
/**
 * @name 地图视野要包含的�?
 * @description
 * 默认为路线的各个路线�?\
 * 如果开启了自定义多段线，则为自定义多段线的首尾�?
 *
 * 如果中心模式为路线点，则只涵盖该路线�?
 */
const includePoints = computed((): Coord[] => {
  if (![100, 99, 98].includes(props.centerMode)) {
    const location = locFromIndex(props.centerMode);
    return [
      {
        latitude: location.lat,
        longitude: location.lng,
      },
    ];
  }

  if (props.customPolylinePoints && props.customPolylinePoints.length) {
    return [
      props.customPolylinePoints[0],
      props.customPolylinePoints[props.customPolylinePoints.length - 1],
      // 避免反复缩放的缓兵之�?
      // ...props.carPosition ? [{
      //     latitude: props.carPosition.lat,
      //     longitude: props.carPosition.lng
      // }] : []
    ];
  } else {
    return [
      // departure
      {
        latitude: departureLoc.value.lat,
        longitude: departureLoc.value.lng,
      },
      // waypoints
      ...waypointLocs.value.map((waypoint) => {
        return {
          latitude: waypoint.lat,
          longitude: waypoint.lng,
        };
      }),
      // arrival
      {
        latitude: arrivalLoc.value.lat,
        longitude: arrivalLoc.value.lng,
      },
      // ...props.carPosition ? [{
      //     latitude: props.carPosition.lat,
      //     longitude: props.carPosition.lng
      // }] : []
    ];
  }
});
/**
 * @name 地图视野要包含的点的padding
 * @description
 * VisibleRect -> DEFAULT_PADDING
 */
const includePointsPadding = computed(() => {
  return props.visibleRect || INCLUDE_POINTS_PADDING_DEFAULT;
});
/**
 * @name 动态行驶信息元素内联样�?
 * @description
 * 控制dynamicDrivenInfo的top, right�?
 *
 * top: menuButton的top�?
 * right: menuButton的right�?+ width
 * height: menuButton的height
 */
const dynamicDrivenInfoStyle = computed(() => {
  return {
    top: `${getMenuButtonPosition().top}px`,
    right: `${getMenuButtonPosition().right + getMenuButtonPosition().width + 6}px`,
    height: `${getMenuButtonPosition().height}px`,
  };
});

const fareText = computed(
  () =>
    lt("static_driven_info.fare.taxi_fare") +
    lt("static_driven_info.fare.unit") +
    planning_result.value[primary_polyline_index.value].taxi_fare?.fare,
);

const distanceDurationText = computed(
  () =>
    (planning_result.value[primary_polyline_index.value].distance / 1000).toFixed(
      1,
    ) +
    lt("static_driven_info.distance.unit") +
    " " +
    planning_result.value[primary_polyline_index.value].duration +
    lt("static_driven_info.duration.unit"),
);

// watch
// [route]
watch(
  () => props.route,
  (newVal, oldVal) => {
    // 判断是否真的有更新，避免抖动（只比较location�?
    // 这是缓兵之计，不是routeMap应该负责�?
    if (newVal && oldVal) {
      // 有效�?
      let updated = false;
      for (let i = 0; i < newVal.length; i++) {
        if (newVal[i].location !== oldVal[i].location) {
          updated = true;
          break;
        }
      }
      if (!updated) return;
    }

    // update useBaseRoute' route
    route.value = props.route;

    // replan(if no customPolylinePoints)
    if (!props.customPolylinePoints || !props.customPolylinePoints.length) {
      if (props.planRoute) plan();
    }
  },
  { deep: true, immediate: true },
);

// [carPosition]
watch(
  () => props.carPosition,
  (newVal, oldVal) => {
    if (newVal) {
      const is_off_track = isOffTrack({
        latitude: newVal.lat,
        longitude: newVal.lng,
      });
      console.log("is_off_track", is_off_track);

      // if from invalid to valid, add marker first
      if (!oldVal) {
        // 设置初始角度
        // car_marker_heading.value = newVal.heading;

        car_marker.value = {
          id: CAR_MARKER_ID,
          latitude: newVal.lat,
          longitude: newVal.lng,
          rotate: 0,
          iconPath: "/static/icon/map-marker-driver.png",
          anchor: MARKER_ANCHOR,
          customCallout: props.showCallout
            ? {
                anchorX: 0,
                anchorY: 0,
                display: "ALWAYS",
              }
            : undefined,
          ...CAR_MARKER_SIZE,
        };

        // 添加到历史记�?
        car_history_points.value.push({
          latitude: newVal.lat,
          longitude: newVal.lng,
        });

        // 启动惯性播�?
        if (props.carAutoplay) {
          pause_car_auto_playing.value = false;
          startAutoplayCar();
        }
      } else {
        if (
          newVal.lat === oldVal.lat &&
          newVal.lng === oldVal.lng &&
          newVal.heading === oldVal.heading
        ) {
          // ignore
          return;
        }

        // translate marker

        // 如果要求贴线，且开启了惯性跑动，则无需手动移动
        if (props.stickCarToPolyline && props.carAutoplay) {
          // 除非偏离路线
          if (!is_off_track) {
            return;
          }
        }

        pause_car_auto_playing.value = true;

        // 计算旋转角度
        // 计算新的旋转角：如果开启了贴线且不偏离路线，则新的角度为车辆旧位置和新的最贴近位置的变化角
        console.log("last destination", last_destination.value);
        // const new_heading = (props.stickCarToPolyline && !is_off_track) && cur_car_stciked.value && last_destination.value
        //     ? calculateHeading(
        //         last_destination.value,
        //         cur_car_stciked.value
        //     )
        //     : newVal.heading;
        const new_heading = newVal.heading;
        console.log("heading", new_heading);

        // 计算目标位置：开启了贴线且不偏离路线，则车辆标记点跟随主要多段线，否则即实际位置
        const destination =
          props.stickCarToPolyline && !is_off_track && cur_car_stciked.value
            ? cur_car_stciked.value
            : {
                latitude: newVal.lat,
                longitude: newVal.lng,
              };
        console.log("destination", destination);

        // 移动
        map_ref.value?.translateMarker({
          markerId: CAR_MARKER_ID,
          destination,
          duration: 3000,
          moveWithRotate: false,
          autoRotate: false,
          rotate: new_heading,
          animationEnd() {
            // 可能启动自动播放
            pause_car_auto_playing.value = false;
          },
          success() {
            last_destination.value = destination;
            recordCarPositionHistory({
              lat: destination.latitude,
              lng: destination.longitude,
              heading: new_heading,
            });
          },
          fail() {
            pause_car_auto_playing.value = false;
          },
        });
      }
    } else {
      console.log("remove car marker");

      // remove marker
      car_marker.value = null;
      // reset history
      car_history_points.value = [];
      // stop autoplay
      pause_car_auto_playing.value = true;
      clearTimeout(car_autoplay_timeout_id.value);
    }
  },
);

// [markers]
watch(markers, (newVal, oldVal) => {
  // compare newVal and oldVal, find out which marker is removed, which is added
  const added_markers = newVal.filter((new_marker) => {
    return !oldVal.some((old_marker) => {
      return new_marker.id === old_marker.id;
    });
  });
  const removed_markers = oldVal.filter((old_marker) => {
    return !newVal.some((new_marker) => {
      return new_marker.id === old_marker.id;
    });
  });

  // if new markers, call map_ref.addMarkers
  if (added_markers.length) {
    map_ref.value?.addMarkers({
      markers: added_markers,
      clear: false,
      fail() {
        errorReport(lt("toast.fail_to_add_markers"));
      },
    });
  }

  // if removed markers, call map_ref.removeMarkers
  if (removed_markers.length) {
    map_ref.value?.removeMarkers({
      markerIds: removed_markers.map((marker) => marker.id),
      fail() {
        errorReport(lt("toast.fail_to_remove_markers"));
      },
    });
  }
});

// [customPolylinePoints]
watch(
  () => props.customPolylinePoints,
  () => {
    // 废弃与自定义多段线相关的值（不废弃其实也会重新计算，问题不大�?
    cur_car_stciked.value = undefined;
  },
);

// [includePoints]
watch(
  [includePoints, includePointsPadding],
  () => {
    map_ref.value?.includePoints({
      points: includePoints.value,
      padding: includePointsPadding.value,
      fail() {
        errorReport(lt("toast.fail_to_include_points"));
      },
    });
  },
  { immediate: true },
);

// [centerPoint]
watch(centerPoint, (newVal) => {
  if (newVal) {
    map_ref.value?.moveToLocation({
      latitude: newVal.latitude,
      longitude: newVal.longitude,
      fail() {
        errorReport(lt("toast.fail_to_move_to_location"));
      },
    });
  }
});

// [pause_car_auto_playing]
watch(pause_car_auto_playing, (newVal, oldVal) => {
  if (!oldVal && newVal) {
    // restart autoplay
    clearTimeout(car_autoplay_timeout_id.value);
    if (props.carPosition && props.carAutoplay) {
      // if enable carAutoPlay, then start it
      startAutoplayCar();
    }
  }
});

// expose
defineExpose({
  resetCarHistory,
  startAutoplayCar,
});

// lifecycle
onMounted(() => {
  // get map context
  const component_instance = getCurrentInstance();
  if (component_instance) {
    map_ref.value = uni.createMapContext("routeMap", component_instance);
  } else {
    errorReport(lt("toast.fail_to_obtain_map_context"));
  }
});
onUnmounted(() => {
  // stop autoplay
  clearTimeout(car_autoplay_timeout_id.value);
});
</script>

<template>
  <map
    id="routeMap"
    ref="routeMap"
    class="map"
    v-if="!is_planning"
    show-location
    traffic
    :min-scale="5"
    :longtiude="centerPoint?.longitude || 0"
    :latitude="centerPoint?.latitude || 0"
    :polyline="polylines"
    :include-points="includePoints"
    :markers="markers"
    @callouttap="onMarkerCalloutTap"
  >
    <view class="static-driven-info" v-if="showStaticDrivenInfo">
      <view
        id="duration-distance"
        class="duration-distance item"
        v-if="showStaticDrivenInfo"
      >
        {{ distanceDurationText }}
      </view>
      <view
        id="fare"
        class="item fare"
        v-if="
          showStaticDrivenInfo &&
          planning_result[primary_polyline_index].taxi_fare !== undefined
        "
      >
        {{ fareText }}
      </view>
    </view>

    <view
      class="dynamic-driven-info"
      :style="dynamicDrivenInfoStyle"
      v-if="dynamicDrivenInfo"
    >
      <view class="dynamic-driven-info__item speed">
        {{ dynamicDrivenInfo.speed.toFixed(2) }}
        {{ lt("dynamic_driven_info.speed.unit") }}
      </view>
      <view class="dynamic-driven-info__item tta">
        {{ (dynamicDrivenInfo.remain_duration / 60).toFixed(1) }}
        {{ lt("dynamic_driven_info.duration.unit") }}
      </view>
      <view class="dynamic-driven-info__item dta">
        {{ (dynamicDrivenInfo.remain_length / 1000).toFixed(2) }}
        {{ lt("dynamic_driven_info.distance.unit") }}
      </view>
    </view>

    <cover-view slot="callout" v-if="showCallout">
      <cover-view
        class="callout"
        v-for="(marker, index) in markers"
        :key="index"
        :marker-id="marker.id"
      >
        <cover-view class="route-item-callout" v-if="marker.id !== CAR_MARKER_ID">
          <cover-view
            class="route-item-callout__time"
            v-if="route[index].datetime"
          >
            {{
              formateTimestamp(route[index].datetime[0] || 0, false, false, true)
            }}
          </cover-view>
          <cover-view class="route-item-callout__address">
            {{ locFromIndex(index).friendly_address }}
          </cover-view>
          <cover-view class="route-item-callout__edit"> > </cover-view>
        </cover-view>
        <cover-view
          class="car-callout"
          v-if="marker.id === CAR_MARKER_ID && carCalloutText"
        >
          {{ carCalloutText }}
        </cover-view>
      </cover-view>
    </cover-view>
  </map>
</template>

<style lang="scss" scoped src="./index.scss"></style>
