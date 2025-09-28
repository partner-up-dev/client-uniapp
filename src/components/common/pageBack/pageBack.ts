import { makeStringProp } from '@/utils/props';
import type { PropType } from 'vue';

// ==================== 组件 Props 定义 ====================
// Minimal back icon component.
export const pageBackProps = {
  size: makeStringProp<'small' | 'medium' | 'large'>('large'),
} as const;

// ==================== 组件 Emits 定义 ====================
export const pageBackEmits = {} as const;
