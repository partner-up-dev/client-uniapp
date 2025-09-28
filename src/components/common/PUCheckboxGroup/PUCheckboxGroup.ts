import type { ExtractPropTypes, InjectionKey, PropType } from 'vue'
import { baseProps, makeBooleanProp, makeNumberProp } from '@/utils/props'

export type PUCheckGroupShape = 'circle' | 'square' | 'button'

export const puCheckboxGroupProps = {
  ...baseProps,
  /** 绑定值：选中的值列表 */
  modelValue: {
    type: Array as PropType<Array<string | number | boolean>>,
    default: () => []
  },
  /** 单选框形状，可选值：circle / square / button */
  shape: String as PropType<PUCheckGroupShape>,
  /** 选中的颜色（作为 currentColor 应用） */
  checkedColor: String,
  /** 禁用 */
  disabled: makeBooleanProp(false),
  /** 最小选中的数量 */
  min: makeNumberProp(0),
  /** 最大选中的数量，0 为无限数量，默认为 0 */
  max: makeNumberProp(0),
  /** 同行展示 */
  inline: makeBooleanProp(false),
  /** 设置大小，可选值：large */
  size: String
}

export type PUCheckboxGroupProps = ExtractPropTypes<typeof puCheckboxGroupProps>

export type RequiredModelValue = {
  modelValue: Array<string | number | boolean>
}

export type PUCheckboxGroupProvide = {
  /** 供子组件读取的父级受控属性（除 modelValue 外均为可选） */
  props: Partial<Omit<PUCheckboxGroupProps, 'modelValue'>> & RequiredModelValue
  /** 子组件请求父级切换选中状态 */
  changeSelectState: (value: string | number | boolean) => void
}

export const PUCHECKBOX_GROUP_KEY: InjectionKey<PUCheckboxGroupProvide> = Symbol('pu-checkbox-group')
