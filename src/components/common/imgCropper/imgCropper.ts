import { baseProps, makeBooleanProp, makeNumberProp, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";

export type ImgCropperShape = "square" | "round";
export type ImgCropperFormat = "jpg" | "png";

export interface ImgCropperChangeDetail {
  scale: number;
  rotate: number;
  translateX: number;
  translateY: number;
}

export interface ImgCropperConfirmResult {
  tempFilePath: string;
  width: number;
  height: number;
}

// ==================== 组件 Props 定义 ====================
export const imgCropperProps = {
  src: makeStringProp(""),
  /** crop area width in px */
  width: makeNumberProp<number | undefined>(undefined as unknown as number),
  /** crop area height in px */
  height: makeNumberProp<number | undefined>(undefined as unknown as number),
  /** shape of the crop area */
  shape: { type: String as PropType<ImgCropperShape>, default: "square" },
  /** initial scale of image */
  scale: makeNumberProp(1),
  /** min & max scale */
  minScale: makeNumberProp(0.3),
  maxScale: makeNumberProp(5),
  /** allow rotate with two fingers */
  enableRotate: makeBooleanProp(false),
  /** initial rotation deg */
  rotate: makeNumberProp(0),
  /** output */
  outputWidth: makeNumberProp(0),
  outputHeight: makeNumberProp(0),
  /** image quality: 0~1, only for jpg */
  quality: makeNumberProp(0.92),
  /** output format */
  format: { type: String as PropType<ImgCropperFormat>, default: "jpg" },
  /** show grid overlay */
  showGrid: makeBooleanProp(true),
  /** disable gestures */
  disabled: makeBooleanProp(false),
  /** canvas id for weapp */
  canvasId: makeStringProp("img-cropper-canvas"),
  ...baseProps,
} as const;

// ==================== 组件 Emits 定义 ====================
export const imgCropperEmits = {
  ready: () => true,
  change: (_detail: ImgCropperChangeDetail) => true,
  confirm: (_file: ImgCropperConfirmResult) => true,
  error: (_err: any) => true,
  "update:scale": (_v: number) => true,
  "update:rotate": (_v: number) => true,
};

// ==================== 组件工具函数 ====================
export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
