// CommutePartnerRequest I18n File

import type { named } from "@/locale/types";

export default {
    specific_content_editor: {
        collapse_title: {
            route: "通勤路线",
            time: "通勤时间",
            transportation: "交通"
        },
        on_at: {
            title: "上班时间",
            label: "何时从家里出发"
        },
        off_at: {
            title: "下班时间",
            label: "何时从公司出发"
        },
        workdays: {
            title: "工作日"
        },
        transportation: {
            title: "交通方式",
            placeholder: "点击选择",
        },
        rules: {
            either_or_on_off_at: "上下班时间必须填写一个",
            workdays_required: "工作日至少一天",
        }
    },
    datetime_pr_content_item: {
        on_at: {
            desc: "上班"
        },
        off_at: {
            desc: "下班"
        },
        workdays: {
            title: "工作日"
        }
    },
    /** Component:CommuteSpecificContentDisplay */
    specific_content_display: {
        on_at: ({named}: {named: named}) => `${named("time")} 上班`,
        off_at: ({named}: {named: named}) => `${named("time")} 下班`,
        workday_segment: ({named}: {named: named}) => `${named("start")} 到 ${named("end")}`
    },
    /** Component:CommuteContentSwiper */
    content_swiper: {
        route: {
            title: "通勤信息"
        },
        ride_hailing_orders: {
            title: "网约车订单"
        }
    }
}
