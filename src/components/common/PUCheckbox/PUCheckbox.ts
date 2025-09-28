import type { ComponentPublicInstance, ExtractPropTypes, PropType } from 'vue'
import { baseProps, makeStringProp } from '@/utils/props'

export type PUCheckShape = 'circle' | 'square' | 'button'
export type PUCheckboxType = 'Default' | 'Bar'

export const puCheckboxProps = {
  ...baseProps,
  /** 自定义 label 区域类名 */
  customLabelClass: makeStringProp(''),
  /** 自定义 shape 区域类名 */
  customShapeClass: makeStringProp(''),
  /** 样式类型：Default | Bar（设计图） */
  type: {
    type: String as PropType<PUCheckboxType>,
    default: 'Default'
  },
  /** 组件绑定值：选中时的值（v-model） */
  modelValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: false
  },
  /** 形状：圆、方、按钮 */
  shape: String as PropType<PUCheckShape>,
  /** 选中时的颜色（作为 currentColor 应用） */
  checkedColor: String,
  /** 禁用 */
  disabled: Boolean,
  /** 与 falseValue 配合使用（非 group 下有效） */
  trueValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: true
  },
  /** 与 trueValue 配合使用（非 group 下有效） */
  falseValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: false
  },
  /** 尺寸：当前仅支持 'large'，不传为默认尺寸 */
  size: String,
  /** 文案最大宽度（如 '120px'） */
  maxWidth: String,
  /** 是否行内显示（非 group 下可用） */
  inline: Boolean
}

export type PUCheckboxProps = ExtractPropTypes<typeof puCheckboxProps>

export type PUCheckboxExpose = {
  /** 切换当前选中状态 */
  toggle: () => void
}

export type PUCheckboxInstance = ComponentPublicInstance<PUCheckboxProps, PUCheckboxExpose>

export const puCheckboxEmits = {
  'update:modelValue': (value: string | number | boolean) => true,
  change: (payload: { value: string | number | boolean }) => true
}
