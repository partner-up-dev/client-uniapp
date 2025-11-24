import type { PropType, ExtractPropTypes } from "vue";
import { makeBooleanProp, makeStringProp, makeRequiredProp } from "@/utils/props";

// ==================== 组件相关类型定义 ====================

export type AccordionItemBeforeExpand = (name: string) => boolean | Promise<unknown>;

// ==================== 组件 Props 定义 ====================
export const puAccordionItemProps = {
  /**
   * 折叠栏的标题，可通过 slot 传递自定义内容
   */
  title: makeStringProp(""),
  /**
   * 禁用折叠栏
   */
  disabled: makeBooleanProp(false),
  /**
   * 折叠栏的标识符，必填
   */
  name: makeRequiredProp(String),
  /**
   * 打开前的回调函数，返回 false 可以阻止打开，支持返回 Promise
   */
  beforeExpand: Function as PropType<AccordionItemBeforeExpand>,
  /**
   * 自定义折叠栏内容容器样式类名
   */
  customBodyClass: makeStringProp(""),
  /**
   * 自定义折叠栏内容容器样式
   */
  customBodyStyle: makeStringProp(""),
  /**
   * 自定义根节点样式类
   */
  customClass: makeStringProp(""),
  /**
   * 自定义根节点样式
   */
  customStyle: makeStringProp(""),
};

export type PUAccordionItemProps = ExtractPropTypes<typeof puAccordionItemProps>;

// ==================== 组件 Emits 定义 ====================
export const puAccordionItemEmits = {
  // no emits
};

// ==================== 组件 Expose 类型定义 ====================
export type PUAccordionItemExpose = {
  /**
   * 获取展开状态
   * @returns boolean
   */
  getExpanded: () => boolean;
  /**
   * 更新展开状态
   */
  updateExpand: () => Promise<void>;
};
