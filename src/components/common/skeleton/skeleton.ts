import type { ExtractPropTypes, PropType, CSSProperties } from "vue";
import { baseProps, makeArrayProp, makeBooleanProp, makeStringProp } from "@/utils/props";

export type SkeletonTheme = "text" | "avatar" | "paragraph" | "image";
export type SkeletonAnimation = "gradient" | "flashed";

export type SkeletonRowColObj = {
  // shape
  type?: "rect" | "circle" | "text";
  // size shortcuts
  size?: string | number;
  width?: string | number;
  height?: string | number;
  // spacing & radius & color
  margin?: string | number;
  marginLeft?: string | number;
  marginRight?: string | number;
  borderRadius?: string | number;
  background?: string;
  backgroundColor?: string;
};

export type SkeletonRowCol = number | SkeletonRowColObj | Array<SkeletonRowColObj>;

export const skeletonProps = {
  ...baseProps,
  /** 骨架图风格 */
  theme: makeStringProp<SkeletonTheme>("text"),
  /** 行列配置 */
  rowCol: makeArrayProp<SkeletonRowCol>(),
  /** 是否显示为加载状态 */
  loading: makeBooleanProp(true),
  /** 动画效果：gradient 渐变，flashed 闪烁；空为无动画 */
  animation: { type: String as PropType<SkeletonAnimation | "">, default: "" },
} as const;

export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>;
