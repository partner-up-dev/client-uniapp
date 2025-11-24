import type { PropType } from "vue";

// ==================== 组件 Props 定义 ====================
export const snackbarProps = {
  title: {
    type: String as PropType<string>,
    required: true,
  },
};

// ==================== 组件 Emits 定义 ====================
export const snackbarEmits = {
  click: () => true,
};