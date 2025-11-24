import type { PropType } from "vue";
import { baseProps, makeStringProp } from "@/utils/props";
import type { Size, Radius } from "@/utils/style";
import type { AccountSimple, AccountRef } from "@/business/account";

// ==================== 组件 Props 定义 ====================
export type AccountType = "Default" | "Tag" | "Avatar";

export const accountProps = {
  /** 账户信息 */
  account: { type: Object as PropType<AccountSimple | null>, default: null },

  /** 账户ID，如果提供，将异步获取账户信息 */
  accountId: { type: String as PropType<AccountRef | null>, default: null },

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
