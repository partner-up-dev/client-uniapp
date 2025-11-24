import type { PropType } from "vue";

// ==================== 组件相关类型定义 ====================

// ==================== 组件常量定义 ====================

// ==================== 组件 Props 定义 ====================
export const partnerRequestTypeEditorProps = {
  showSecondConfirmButton: {
    type: Boolean,
    default: false
  },
  safeAreaInsetBottom: {
    type: Boolean,
    default: true
  }
};

// ==================== 组件 Emits 定义 ====================
export const partnerRequestTypeEditorEmits = {
  confirm: (selected_type: any) => true
};

// ==================== 组件工具函数 ====================