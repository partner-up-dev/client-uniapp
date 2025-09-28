import type { PropType } from "vue";
import { DEFAULT_ACCOUNT_AVATAR } from "@/data/const";
import { baseProps, makeBooleanProp, makeStringProp } from "@/utils/props";
import { type Radius, type Size } from "@/utils/style";

// ==================== 组件内部类型定义 ====================

// ==================== 组件 Props 定义 ====================
export const avatarProps = {
  /** 头像图片链接 */
  src: {
    type: String as PropType<string | null>,
    default: DEFAULT_ACCOUNT_AVATAR,
  },

  /** 右下角角标数值，0 不显示 */
  badge: {
    type: Number,
    default: 0,
  },

  /** 角标最大显示，超过显示为 `max+` */
  badgeMax: {
    type: Number,
    default: 99,
  },

  /** 头像尺寸 */
  size: {
    type: String as PropType<Size>,
    default: "Small",
  },

  /** 圆角大小 */
  radius: makeStringProp<Radius>('full'),
  /** 是否可编辑（点击可选择并裁剪图片） */
  editable: makeBooleanProp(false),

  /** 上传函数：接收临时文件路径，返回上传后地址（由父级处理） */
  upload: {
    type: Function as PropType<(fp: string) => Promise<string>>,
  },

  ...baseProps,
};

// ==================== 组件 Emits 定义 ====================
export const avatarEmits = {
  // 目前无自定义事件，如后续需要可在此补充
} as const;

// ==================== 组件工具函数（预留） ====================
export function noop() {
  return void 0;
}
