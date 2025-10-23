// Types of Component:ImmersiveRouteEditor

import type { Route } from "@/types/partner_request/trip";
import { route_default } from "@/types/partner_request/trip/edit";
import type { PropType } from "vue";

export const ImmersiveRouteEditorProps = {
    modelValue: {
        type: Array as PropType<Route>,
        default: () => route_default(true)
    },
    /**
     * @name 使用内置的出发时间编辑器
     */
    useDepDatetimeEditor: {
        type: Boolean,
    }
}

export const ImmersiveRouteEditorEmits = {
    /**
     * @name 完成
     * @description
     * 必要的数据都已经填写完毕且合法
     */
    complete: () => true,
    /**
     * @name 编辑出发点时间
     */
    edit_dep_time: () => true,
}