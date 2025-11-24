// ZH-Hans Translation of PartnerRequest/Trip Module

export default {
    /**
     * @name 出行偏好编辑器的翻译
     */
    preference_editor: {
        purpose: {
            title: "出行目的",
            placeholder: "点击选择"
        },
        luggage: {
            prefix: "行李",
            placeholder: "输入数量",
            unit: "件"
        },
        flight: {
            placeholder: "航班号"
        },
        train: {
            placeholder: "列车号"
        },
    },
    /**
     * @name 火车/飞机出行补充性信息编辑器的翻译
     */
    rf_trip_sup_info_editor: {
        flight_takeoff_at: {
            label: "航班起飞时间",
        },
        flight_arrives_at: {
            label: "航班落地时间",
        },
        railway_setoff_at: {
            label: "火车开点",
        },
        railway_arrives_at: {
            label: "火车到站时间",
        },
        /** 推荐日期时间配置调整 */
        rdta: {
            title: {
                prefix: "据",
                airport_dropoff: "起飞时间",
                airport_pickup: "落地时间",
                railway_dropoff: "火车开点",
                railway_pickup: "到站时间",
                suffix: "调整出发时间"
            },
            content: {
                anatomy_dropoff: {
                    route_eta: "车程约",
                    reserve_time: {
                        railway_dropoff: "分钟，另为进站安检、堵车等预留",
                        airport_dropoff: "分钟，另为安检托运、堵车等预留"
                    },
                    unit: "分钟"
                },
                anatomy_pickup: {
                    reserve_time: {
                        railway_pickup: "为出站等预留",
                        airport_pickup: "为穿梭、取行李等预留"
                    },
                    unit: "分钟"
                },
                new_dep: {
                    prefix: "故建议",
                    suffix: "出发",
                    airport_dropoff: "去机场",
                    railway_dropoff: "去火车站",
                    airport_pickup: "离开机场",
                    railway_pickup: "离开火车站",
                    undefined: "错误的出行目的"
                },
                new_arr: {
                    prefix: "建议",
                    suffix: "到达",
                    airport_dropoff: "去机场",
                    railway_dropoff: "去火车站",
                    airport_pickup: "离开机场",
                    railway_pickup: "离开火车站",
                    undefined: "未知出行目的"
                },
                est_arr: {
                    prefix: "预计",
                    suffix: "到达，车程",
                    unit: "分种",
                },
                bring_ahead: {
                    prefix: "最多接受提前",
                    suffix: "分钟出发的搭子，不延后",
                    unit: "分钟"
                },
                put_off: {
                    prefix: "最多接受延后",
                    suffix: "分钟出发的搭子，不提前",
                    unit: "分钟"
                }
            },
            tension_slider: {
                title: "调整松紧度",
                level_name: {
                    0: "踩点到",
                    1: "不多不少",
                    2: "留够时间"
                }
            },
            operations: {
                cancel: "取消",
                accept: "接受",
                tips: "接受后你仍然可以根据需要调整"
            },
        },
        toast: {
            failed_to_apply_config: "无法应用时间配置",
            failed_to_estimate: "无法估算路线耗时",
            invalid_trip_purpose: "无效的出行目的",
        }
    }
}
