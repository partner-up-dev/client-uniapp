import type { PropType } from "vue";
import { baseProps, makeStringProp } from "@/utils/props";
import type { Size, Radius } from "@/utils/style";

// ==================== 组件 Props 定义 ====================
export type AccountType = "Default" | "Tag";

export const accountProps = {
  /** 昵称文案 */
  nickname: makeStringProp<string>("用户昵称"),

  /** 头像图片链接，可为空以使用默认头像 */
  avatarSrc: { type: String as PropType<string | null>, default: null },

  /** 展示类型：默认/标签底色 */
  type: makeStringProp<AccountType>("Default"),

  /** 头像尺寸，遵循设计代币 */
  size: { type: String as PropType<Size>, default: "small" },

  /** 头像圆角 */
  avatarRadius: { type: String as PropType<Radius>, default: "full" },

  ...baseProps,
} as const;

// ==================== 组件 Emits 定义 ====================
export const accountEmits = {
  click: () => true,
} as const;
