// Types of Component:Common:Cell

import type { Size } from "@/utils/style";
import { makeStringProp } from "@/utils/props";

export type CellType = 'horizontal' | 'vertical';

export const CellProps = {
    type: makeStringProp<CellType>("horizontal"),
    title: makeStringProp<string>(''),
    subtitle: makeStringProp<string | undefined>(undefined),
    suffixIcon: makeStringProp<string | undefined>(undefined),
    prefixIcon: makeStringProp<string | undefined>(undefined),
    value: makeStringProp<string | undefined>(undefined),
    size: makeStringProp<Size>("small"),
    /**
     * Form field property name for validation error display
     * When used inside PUForm, this links the cell to a form field
     */
    formProp: makeStringProp<string | undefined>(undefined),
}

export const CellEmits = {
    'click': () => true,
}
