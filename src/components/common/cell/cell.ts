// Types of Component:Common:Cell

import type { Size } from "@/utils/style";
import { makeBooleanProp, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";

export type CellType = 'default' | 'vertical';

export type CellEditorType = 'common_picker' | 'location_picker' | 'common_input' | 'get_phone_number';
export type CellValueType = string | number | undefined;
export type CellValueFormatterType = (val: any) => string;
/** 包含了有关于使用单元格编辑相关功能所需的配置 */
export interface CellEditorConfig {
    type: CellEditorType;
    data?: any;
    formatter?: CellValueFormatterType;
}

export const CellProps = {
    type: makeStringProp<CellType>("vertical"),
    title: makeStringProp<string>(''),
    subtitle: makeStringProp<string>(''),
    value: makeStringProp<CellValueType>(undefined),
    valueFormmater: {
        type: Function as PropType<CellValueFormatterType>,
    },
    valuePlaceholder: makeStringProp<string>(''),
    editorType: makeStringProp<CellEditorType>("common_picker"),
    editorData: {
        type: Object as PropType<any>,
    },
    editable: makeBooleanProp(false),
    size: makeStringProp<Size>("small"),
    showArrow: makeBooleanProp(false),
}

export const CellEmits = {
    'confirm': (value: CellValueType) => true,
    'cancel': () => true,
    'editing': () => true,
}
