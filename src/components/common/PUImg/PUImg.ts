import { baseProps } from "@/utils/props";
import type { ImageMode } from "@uni-helper/uni-app-types";
import type { PropType } from "vue";
import type { Size, Radius } from "@/utils/style";

// ==================== 组件 Props 定义 ====================

export const puImgProps = {
  src: { type: String, default: "" },
  mode: { type: String as PropType<ImageMode>, default: "aspectFill" },
  showLoading: { type: Boolean, default: true },
  showError: { type: Boolean, default: true },
  /**
   * Preferred square size of the image container.
   * When provided, it takes precedence over `width` and `height`.
   * Maps to design tokens in `src/styles/_token.scss`:
   * xSmall, small, medium, large, xLarge
   */
  size: {
    type: String as PropType<Size>,
    default: undefined,
  },
  width: { type: [Number, String] as PropType<number | string>, default: undefined },
  height: { type: [Number, String] as PropType<number | string>, default: undefined },
  lazyLoad: { type: Boolean, default: true },
  customImage: { type: String, default: "" },
  radius: {
    type: String as PropType<Radius>,
    default: 'none',
  },
  ...baseProps
} as const;

// ==================== 组件 Emits 定义 ====================
export const puImgEmits = {
  load: (_evt: any) => true,
  error: (_evt: any) => true,
};
