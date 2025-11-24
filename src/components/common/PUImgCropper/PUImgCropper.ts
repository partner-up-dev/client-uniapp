import { baseProps, makeBooleanProp, makeNumberProp, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";

// ==================== 组件相关类型定义 ====================

/**
 * 裁剪框形状类型
 */
export type PUImgCropperShape = "square" | "round";

/**
 * 输出图片格式
 */
export type PUImgCropperFormat = "jpg" | "png";

/**
 * 变换状态变化详情
 */
export interface PUImgCropperChangeDetail {
  scale: number;
  rotate: number;
  translateX: number;
  translateY: number;
}

/**
 * 裁剪确认结果
 */
export interface PUImgCropperConfirmResult {
  tempFilePath: string;
  width: number;
  height: number;
}

// ==================== 组件常量定义 ====================

export const DEFAULT_CROPPER_SIZE = 300;
export const DEFAULT_MIN_SCALE = 0.3;
export const DEFAULT_MAX_SCALE = 5;
export const DEFAULT_QUALITY = 0.92;
export const GRID_OPACITY = 0.35;

// ==================== 组件 Props 定义 ====================

export const puImgCropperProps = {
  /**
   * 图片源地址
   */
  src: makeStringProp(""),

  /**
   * 裁剪区域宽度（px）
   */
  width: makeNumberProp<number | undefined>(undefined as unknown as number),

  /**
   * 裁剪区域高度（px）
   */
  height: makeNumberProp<number | undefined>(undefined as unknown as number),

  /**
   * 裁剪框形状
   */
  shape: {
    type: String as PropType<PUImgCropperShape>,
    default: "square"
  },

  /**
   * 图片初始缩放比例
   */
  scale: makeNumberProp(1),

  /**
   * 最小缩放比例
   */
  minScale: makeNumberProp(DEFAULT_MIN_SCALE),

  /**
   * 最大缩放比例
   */
  maxScale: makeNumberProp(DEFAULT_MAX_SCALE),

  /**
   * 是否允许双指旋转
   */
  enableRotate: makeBooleanProp(false),

  /**
   * 图片初始旋转角度（度）
   */
  rotate: makeNumberProp(0),

  /**
   * 输出图片宽度（px），默认使用裁剪区域宽度
   */
  outputWidth: makeNumberProp(0),

  /**
   * 输出图片高度（px），默认使用裁剪区域高度
   */
  outputHeight: makeNumberProp(0),

  /**
   * 输出图片质量（0~1），仅对 jpg 格式有效
   */
  quality: makeNumberProp(DEFAULT_QUALITY),

  /**
   * 输出图片格式
   */
  format: {
    type: String as PropType<PUImgCropperFormat>,
    default: "jpg"
  },

  /**
   * 是否显示网格线
   */
  showGrid: makeBooleanProp(true),

  /**
   * 是否禁用手势操作
   */
  disabled: makeBooleanProp(false),

  /**
   * Canvas ID（小程序专用，需要保证唯一性）
   */
  canvasId: makeStringProp("pu-img-cropper-canvas"),

  ...baseProps,
} as const;

// ==================== 组件 Emits 定义 ====================

export const puImgCropperEmits = {
  /**
   * 图片加载完成
   */
  ready: () => true,

  /**
   * 变换状态变化
   */
  change: (_detail: PUImgCropperChangeDetail) => true,

  /**
   * 裁剪确认
   */
  confirm: (_result: PUImgCropperConfirmResult) => true,

  /**
   * 裁剪错误
   */
  error: (_err: any) => true,

  /**
   * 缩放比例变化（双向绑定）
   */
  "update:scale": (_value: number) => true,

  /**
   * 旋转角度变化（双向绑定）
   */
  "update:rotate": (_value: number) => true,
};

// ==================== 组件工具函数 ====================

/**
 * 限制数值在指定范围内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 计算两点之间的距离
 */
export function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 计算两点之间的角度（度）
 */
export function getAngle(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}
