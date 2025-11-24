// Component:PartnerRequest:DraftPicker's Types

import type { PRRef } from "@/business/partner_request";
import { baseProps, makeBooleanProp, makeStringProp } from "@/utils/props";

export const PRDraftPickerProps = {
    /**
     * @name 指定获取哪个用户的草稿
     */
    accountId: makeStringProp(undefined),
    /**
     * @name 是否启用边缘渐变效果
     * @description
     * 启用后会在滚动区域底部添加渐变效果，与背景融合
     */
    fade: makeBooleanProp(false),
    ...baseProps
}

export const PRDraftPickerEmits = {
    'select': (pr_id: PRRef) => true
}