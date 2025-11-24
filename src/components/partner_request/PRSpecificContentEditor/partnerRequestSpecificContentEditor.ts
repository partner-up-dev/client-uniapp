import type { PropType } from "vue";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const partnerRequestSpecificContentEditorProps = {
  type: {
    type: String as PropType<string>,
    required: true,
  },
  form: {
    type: Object as PropType<any>,
    required: true,
  },
};

// ==================== 组件 Emits 定义 ====================
export const partnerRequestSpecificContentEditorEmits = {
  change: (event: any) => true,
};

// ==================== 组件工具函数 ====================