/**
 * @abstract RideHailing PartnerRequest Module's i18n file
 */

import type { named } from "@/locale/types"

export default {
    title: {
        // PRContentId: title
        // 用于PRContentItem的front-title
        route: "路线信息"
    },
    operation: {
        route: {
            execute: {
                
            }
        }
    },
    /** 从搭子请求到网约车下单入口按钮 */
    on_pr_order_button: {
        view_order: "查看订单",
        go_order: "去打车",
        toast: {
            invalid_order_id: "无效的订单号",
            stop_waiting_for_partners_first: "请先停止寻找搭子"
        }
    },
    contract: {
        // PRContentId: clause title
        // 条款/契约场景下的PRContentId对应标题
        // 用于PRContentItem的back-title
        title: {
            route: "打车之路线条款"
        }
    },
    store: {
        to_partner_request_datail: {
            null: "没有绑定搭子请求"
        }
    },
    order_placing: {
        partner_request: {
            prefix: "你正在为",
            suffix: "呼叫网约车"
        },
        passengers: {
            with_you: "将会与你同行"
        },
        price: {
            unselected: "未选择"
        },
        footer: {
            departure_at: "出发",
            edit_location: "编辑路线",
            place_order: "呼叫"
        },
        place: {
            toast: {
                loading: "下单中...",
                split_bill_lost: "平账账单丢失，请报告",
                split_bill_rejected: "你否决了账单，订单取消",
                invalid_departure_at: "无效的出发时间，请重试",
                caller_phone_required: "请填写联系电话",
            }
        },
        route: {
            no_more_then_2: "暂不支持途经点下单",
            pr_has_an_order: "该搭子请求已下单",
        }
    },
    order_detail: {
        on_load: {
            invalid_order_id: "无效的订单号"
        },
        refresh_order: {
            get_status_error: "无法获取最新状态"
        },
        metadata: {
            status: {
                pending: "需要审批并预付",
                dispatching: "派单中",
                accepted: "已接单",
                picking_up: "接客中",
                arrived: "已到达上车点",
                picked: "已接到乘客",
                in_progress: "送客中",
                dropped: "已送达",
                unpaid: "需要支付",
                review_opening: "可以评价",
                closed: "已完单",
                cancelled: "已取消",
                error: "订单异常",
                on_prosecuted: "客服介入"
            },
            status_description: {
                pending: "所有同行人都同意并支付后，将会自动派单（注意查看账单时限）",
                dispatching: "努力为您寻找司机中...",
                accepted: "已接单，等待司机出发接客",
                picking_up: "司机正在前往上车点，请提前到达约定地点",
                arrived: "请尽快上车",
                picked: "请系好安全带，司机即将出发",
                in_progress: "坐和放宽，司机正在前往目的地",
                dropped: "请携带好随身物品，注意车辆侧后方情况，安全下车",
                unpaid: "有未支付款项，前往账单中查看",
                review_opening: "已经结清，可以对本次服务进行评价",
                closed: "感谢您的使用，期待再与您同行",
                error: "请联系客服介入",
                on_prosecuted: "客服处理中，请耐心等待结果",
                cancelled: "订单已被取消，可以在账单中查看费用；理由："
            },
            cancel_reason: {
                competitors_expired: "价格信息已过期",
                payment_timedout: "有同行人超时未预付账单",
                competitors_unresponsive: "无司机接单",
                passenger_unreachable: "司机反映无法联系到乘客",
                route_changed: "行程有变",
                no_reason: "无理由",
                consensual: "司乘协商一致",
                pickup_late: "司机迟到",
                accidental: "误操作",
                driver_unreachable: "无法联系到司机",                
            }
        },
        navigation_info: {
            null: "无导航信息",
            route_null: "无行驶路线信息",
            failed_to_fetch: "获取路线与导航信息失败",
        },
        passengers: {
            desc: "与你同行"
        },
        operation: {
            check_split_bill: "查看账单",
            cancel_order: "取消订单",
            check_partner_request: "查看搭子请求",
            review_order: "评价订单"
        },
        more_actions_sheet: {
            title: "更多操作"
        },
        ordered_ride_types: {
            title: "已下单车型"
        },
        preference: {
            title: "偏好",
        },
        route: {
            title: "路线",
        }
    },
    driver_info_display: {
        call: {
            you_are_not_passenger: "您不是乘客",
            phone_not_found: "服务商未支持您联系司机"
        }
    },
    ride_type_display: {
        right: {
            estimated_to_be: "预计",
            fare_type: {
                common: "正常计费",
                route_fixed: "路线一口价",
                special_fixed: "尊享一口价"
            }
        }
    },
    cancel_order: {
        title: {
            not_cancelled: "取消订单",
            cancelled: "订单已取消"
        },
        description: {
            available: ({named}: {named: named}) => `预计有${named("cancel_fee")}元的取消费`,
            unavailable: '已经不可取消',
            cancelled: ({named}: {named: named}) => `已被取消，取消原因：${named("cancel_reason")}`
        },
        reason: {
            null: "未取消",
            no_reason: "无理由",
            accidental: "误操作",
            driver_unreachable: "无法联系到司机",
            pickup_late: "司机迟到",
            route_changed: "行程变更",
            consensual: "司乘协商一致",
            competitors_expired: "价格信息已过期",
            competitors_unresponsive: "无司机接单",
            passenger_unreachable: "司机反映无法联系到乘客"
        },
        detail: {
            placeholder: "您可以补充具体原因，也可以不填"
        },
        cancel: {
            success: "取消成功",
            loading: "取消中..."
        }
    },
    ride_type_ad: {
        default: {
            title: "推广标题",
            desc: "推广描述文本，如果你读到此处，代表数据加载失败，请刷新页面；如果问题持续，请报告给开发者"
        },
        error: {
            appid_invalid: "推广APPID无效",
            route_invalid: "无效的路线信息",
            route_copy_failed: "复制失败"
        },
        success: {
            route_copied: "已复制路线信息"
        },
        operations: {
            cta: "去领取优惠",
            tips: "路线信息会自动复制到剪贴板"
        }
    },
    ad_manager: {
        title: "打车有优惠"
    },
    /** RideHailingOrders Component i18n */
    orders: {
        title: "网约车订单"
    },
    /** 
     * @name 网约车搭子请求特有内容编辑器的翻译
     */
    specific_content_editor: {
        trip_preference: {
            title: "出行偏好"
        },
        route: {
            title: "路线"
        }
    }
}
