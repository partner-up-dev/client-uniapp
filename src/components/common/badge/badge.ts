import { baseProps, makeBooleanProp, makeStringProp } from "@/utils/props";
import type { ExtractPropTypes, PropType } from "vue";

export type BadgeType = "primary" | "success" | "warning" | "danger" | "info";

export const badgeProps = {
  ...baseProps,
  /** 显示值 */
  modelValue: { type: [Number, String] as PropType<number | string>, default: undefined },
  /** 当数值为 0 时，是否展示徽标 */
  showZero: makeBooleanProp(false),
  /** 自定义背景色 */
  bgColor: String,
  /** 最大值，超过最大值会显示 "{max}+"，要求 value 是 Number 类型 */
  max: Number,
  /** 是否为红色点状标注 */
  isDot: makeBooleanProp(false),
  /** 是否隐藏 badge */
  hidden: makeBooleanProp(false),
  /** badge 类型 */
  type: makeStringProp<BadgeType | undefined>(undefined),
  /** 偏移：为正时向下偏移对应像素（顶部位置） */
  top: { type: [Number, String] as PropType<number | string>, default: undefined },
  /** 偏移：为正时向左偏移对应像素（右侧位置） */
  right: { type: [Number, String] as PropType<number | string>, default: undefined },
  /** 兼容：为正时，角标向上偏移（底部位置） */
  bottom: { type: [Number, String] as PropType<number | string>, default: undefined },
  /** 可选：为正时，角标向右偏移（左侧位置） */
  left: { type: [Number, String] as PropType<number | string>, default: undefined },
} as const;

export type BadgeProps = ExtractPropTypes<typeof badgeProps>;
