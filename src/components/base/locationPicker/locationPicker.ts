// Types of Component:Base:LocationPicker

import type { LocationRef } from "@/business/base/route";
import { makeBooleanProp, makeStringProp } from "@/utils/props";
import type { PropType } from "vue";

export const LocationPickerProps = {
    /**
     * @name 是否显示选择器界面
     */
    show: makeBooleanProp(false),
    /**
     * @name 当前地理位置值
     */
    modelValue: {
        type: String as PropType<LocationRef>,
    },
    placeholder: makeStringProp<undefined | string>(undefined)
}

export const LocationPickerEmits = {
    "update:modelValue": (value: LocationRef) => true,
    "confirm": (value: LocationRef) => true,
    "update:show": (value: boolean) => true
}



