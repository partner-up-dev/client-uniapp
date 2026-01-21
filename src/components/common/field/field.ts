// Types of Component:Common:Field

import type { Size } from "@/utils/style";
import { makeBooleanProp, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";
import enUs from "./field.en-US.jsonc";
import zhHans from "./field.zh-Hans.jsonc";

export const localMessages = {
  "zh-Hans": zhHans,
  "en-US": enUs,
} as const;

export type FieldEditorType = 'common_picker' | 'location_picker' | 'common_input' | 'get_phone_number';
export type FieldValueType = string | number | undefined;
export type FieldValueFormatterType = (val: any) => string;
/** 包含了有关于使用字段编辑相关功能所需的配置 */
export interface FieldEditorConfig {
  type: FieldEditorType;
  data?: any;
  formatter?: FieldValueFormatterType;
}

export const FieldProps = {
  title: makeStringProp<string>(''),
  value: makeStringProp<FieldValueType>(undefined),
  valueFormmater: {
    type: Function as PropType<FieldValueFormatterType>,
  },
  valuePlaceholder: makeStringProp<string>(''),
  editorType: makeStringProp<FieldEditorType>("common_picker"),
  editorData: {
    type: Object as PropType<any>,
  },
  editable: makeBooleanProp(false),
  size: makeStringProp<Size>("small"),
}

export const FieldEmits = {
  'confirm': (value: FieldValueType) => true,
  'cancel': () => true,
  'editing': () => true,
}
