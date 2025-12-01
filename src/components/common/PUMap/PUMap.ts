import type { PropType } from "vue";
import { type Coord } from "@/business/base/route";
import type { GeoElement } from "../GeoElement/GeoElement";
import { makeBooleanProp } from "@/utils/props";

// ==================== 地图相关类型定义 ===================='


export interface GeoElementWithIndex {
  value: GeoElement;
  index: number;
}

// ==================== 组件 Props 定义 ====================
export const puMapProps = {
  /**
   * 地理元素数据数组
   */
  elements: {
    type: Array as PropType<GeoElement[]>,
    default: () => [],
  },
  /**
   * 地图中心点坐标
   */
  center: {
    type: Object as PropType<Coord>,
    default: undefined,
  },
  /**
   * 是否显示用户位置
   */
  showLocation: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**
   * 是否启用3D地图
   */
  enable3d: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /**
   * 是否显示指南针
   */
  showCompass: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /**
   * 是否显示比例尺
   */
  showScale: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  /**
   * 是否允许滚动
   */
  enableScroll: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**
   * 是否允许缩放
   */
  enableZoom: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  showResetBtn: makeBooleanProp(true),
  /**
   * 地图容器高度
   */
  height: {
    type: String as PropType<string>,
    default: "224px",
  },
  /**
   * 地图ID（用于多个地图实例）
   */
  mapId: {
    type: String as PropType<string>,
    default: "pu-map",
  },
  /**
   * 当前激活的地理元素
   */
  activeElement: {
    type: Object as PropType<GeoElementWithIndex | null | undefined>,
    default: undefined,
  },
};

// ==================== 组件 Emits 定义 ====================
export const puMapEmits = {
  "update:activeElement": (element: GeoElementWithIndex | null | undefined) => true,
  "update:center": (center: Coord | undefined) => true,
  defaultBtnClick: () => true,
};

// ==================== 组件常量定义 ====================

/**
 * 地图操作按钮尺寸
 */
export const MAP_CONTROL_SIZE = {
  width: 32,
  height: 32,
} as const;

/**
 * 默认标记点图标路径
 */
export const DEFAULT_MARKER_ICONS = {
  start: "/static/icon/map-marker-from.png",
  waypoint: "/static/icon/map-marker-waypoint.png",
  end: "/static/icon/map-marker-to.png",
  driver: "/static/icon/map-marker-driver.png",
} as const;

/**
 * 默认折线样式
 */
export const DEFAULT_POLYLINE_STYLE = {
  color: "#96d945",
  width: 4,
  borderColor: "#ffffff",
  borderWidth: 2,
} as const;

// ==================== 组件工具函数 ====================

/**
 * 将颜色转换为8位十六进制格式（包含alpha通道）
 * @param color 颜色值，如 "#96d945"
 * @param alpha 透明度，0-1之间的数值
 * @returns 8位十六进制颜色，如 "#96d945FF" 或 "#96d9454D"
 */
export function colorWithAlpha(color: string, alpha: number): string {
  // 确保alpha在0-1之间
  alpha = Math.max(0, Math.min(1, alpha));

  // 将alpha转换为十六进制（0-255）
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase();

  // 如果颜色已经是8位，替换alpha部分；否则添加alpha部分
  if (color.length === 9) {
    return color.substring(0, 7) + alphaHex;
  } else if (color.length === 7) {
    return color + alphaHex;
  }

  return color;
}

/**
 * 获取用户当前位置
 * @param options 配置选项
 * @returns Promise<MapCenter>
 */
export function getUserLocation(options: {
  type?: 'gcj02' | 'wgs84';
  geocode?: boolean;
  timeout?: number;
} = {}): Promise<Coord> {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: options.type || 'gcj02',
      geocode: options.geocode ?? false,
      timeout: options.timeout || 10000,
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
        });
      },
      fail: (err) => {
        console.error("Failed to get location:", err);
        uni.showToast({
          title: "获取位置失败",
          icon: "none",
          duration: 2000,
        });
        reject(err);
      },
    });
  });
}