import type { PropType, InjectionKey, ExtractPropTypes } from "vue";
import { makeBooleanProp, makeNumberProp, makeStringProp } from "@/utils/props";

// ==================== 组件相关类型定义 ====================

export type AccordionToggleAllOptions =
  | boolean
  | {
    expanded?: boolean;
    skipDisabled?: boolean;
  };

export type AccordionProvide = {
  props: Partial<PUAccordionProps>;
  toggle: (name: string, expanded: boolean) => void;
};

export const PUACCORDION_KEY: InjectionKey<AccordionProvide> = Symbol("pu-accordion");

// ==================== 组件 Props 定义 ====================
export const puAccordionProps = {
  /**
   * 绑定值
   * - 手风琴模式下为 string
   * - 普通模式下为 string[]
   * - 查看更多模式下为 boolean
   */
  modelValue: {
    type: [String, Array, Boolean] as PropType<string | Array<string> | boolean>,
  },
  /**
   * 手风琴模式，同时只能展开一个面板
   */
  accordion: makeBooleanProp(false),
  /**
   * 查看更多模式，用于展示折叠内容
   */
  viewmore: makeBooleanProp(false),
  /**
   * 查看更多模式下，是否使用自定义展开按钮插槽
   */
  useMoreSlot: makeBooleanProp(false),
  /**
   * 查看更多模式下，收起时的显示行数
   */
  lineNum: makeNumberProp(2),
  /**
   * 自定义根节点样式类
   */
  customClass: makeStringProp(""),
  /**
   * 自定义根节点样式
   */
  customStyle: makeStringProp(""),
  /**
   * 查看更多模式下的插槽外部自定义样式
   */
  customMoreSlotClass: makeStringProp(""),
};

export type PUAccordionProps = ExtractPropTypes<typeof puAccordionProps>;

// ==================== 组件 Emits 定义 ====================
export const puAccordionEmits = {
  change: (detail: { value: string | string[] | boolean }) => true,
  "update:modelValue": (value: string | string[] | boolean) => true,
};

// ==================== 组件 Expose 类型定义 ====================
export type PUAccordionExpose = {
  /**
   * 切换所有面板展开状态
   * @param options 面板状态，传 true 为全部展开，false 为全部收起，不传参为全部切换
   */
  toggleAll: (options?: AccordionToggleAllOptions) => void;
};
