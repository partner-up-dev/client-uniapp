import type { PropType } from "vue";
import { makeArrayProp } from "@/utils/props";
import { PRL1Type, PRType } from "@/business/partner_request";

// ==================== 组件相关类型定义 ====================

/**
 * 表单内容类型 - 可以是任意对象
 */
export type PRFormContent = Record<string, any>;

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const prImmersiveFormProps = {
  /**
   * 步骤名称列表
   */
  steps: makeArrayProp<string>(),

  /**
   * 搭子请求一级类型
   */
  l1Type: {
    type: String as PropType<PRL1Type>,
    default: undefined,
  },

  /**
   * 搭子请求二级类型
   * @description
   * 由父组件控制，如果为有效值，则点击"直接填表"时，直接进入表单，否则要求选择类型
   */
  l2Type: {
    type: String as PropType<PRType>,
    default: undefined,
  },

  /**
   * 搭子请求表单数据
   * @description
   * 用于保存搭子请求的表单数据
   */
  prForm: {
    type: Object as PropType<PRFormContent>,
    default: () => ({}),
  },
};

// ==================== 组件 Emits 定义 ====================
export const prImmersiveFormEmits = {
  /**
   * 更新二级类型
   */
  "update:l2Type": (l2Type: PRType) => true,

  /**
   * 切换至下一步
   * @description
   * 在最后一步进入下一步（即完成），也算在内（此时next未定义）
   * @param source - 触发来源：'user'（用户手动操作）或 'parent'（父组件调用）
   * @param current - 当前步骤名称
   * @param next - 下一步骤名称（最后一步时为 undefined）
   */
  next: (source: "user" | "parent", current: string, next?: string) => true,
};

// ==================== 组件工具函数 ====================
