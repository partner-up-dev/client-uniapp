// Types of Component:Common:Cell

import type { Size } from "@/utils/style";
import { makeStringProp } from "@/utils/props";

export type CellType = 'default';

export const CellProps = {
    type: makeStringProp<CellType>("default"),
    title: makeStringProp<string>(''),
    subtitle: makeStringProp<string | undefined>(undefined),
    suffixIcon: makeStringProp<string | undefined>(undefined),
    prefixIcon: makeStringProp<string | undefined>(undefined),
    value: makeStringProp<string | undefined>(undefined),
    size: makeStringProp<Size>("small"),
}

export const CellEmits = {
    'click': () => true,
}
