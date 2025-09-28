// TranslationFile | Zh-Hans | OnBoarding Module | index.ts

export default {
    /**
     * @name 新用户引导页面的翻译
     * @file src/pages/on_boarding/new_user
     */
    new_user: {
        header: {
            title: {
                step1: "欢迎，",
                step2: "继续，",
                step3: "开始！"
            },
            subtitle: {
                step1: "",
                step2: "了解你，才能对你好",
                step3: "找搭子，就在搭一把"
            },
        },
        feature_carousel: [
            [
                "我们帮你找搭子",
                "快速、合适、安全"
            ],
            [
                "找网约车搭子",
                "飞机火车不延误"
            ],
            [
                "找通勤搭子",
                "无负担做精致上班族"
            ]
        ],
        operation_next: {
            step1: "选好了",
            step2: "完成",
            step3: "首页"
        },
        content: {
            title: {
                step1: "选择你感兴趣的搭子",
                step2: "",
                step3: "开始使用搭一把"
            }
        },
        /**
         * @name 感兴趣的搭子类型选择器
         * @type {Record<PartnerRequestType, {title: string, description: string[]}>}
         */
        pr_type_picker: {
            ride_hailing: {
                title: "网约车搭子",
                description: [
                    "找搭子一起乘坐网约车，分摊车费",
                    "当你赶火车、飞机时，我们只会为您匹配目的相同的搭子以避免延误"
                ]
            },
            commute: {
                title: "通勤搭子",
                description: [
                    "拒绝拥挤的大众交通，坐车上班不早起",
                    "找个长期的通勤搭子，更不必担忧费用问题，低成本也能做精致上班族"
                ]
            },
            moped: {
                title: "电瓶搭子",
                description: [
                    "电瓶车是学校到地铁站、超商等短途出行的最佳选择",
                    "若您是电瓶车主，还能赚点外快！"
                ]
            },
            hitchhiking: {
                title: "便车搭子",
                description: [
                    "您可以作为车主找顺路的搭子分摊油费路费，也可以作为乘客寻找顺路的车主",
                ]
            },
        },
        personalized_questions: {
            residential_address: {
                name: "现居区域",
                placeholder: "点击以选择"
            },
            freq_railway_or_airport: {
                name: "常去的火车站或机场",
                placeholder: "点击以选择"
            },
            work_address: {
                name: "在哪上班",
                placeholder: "点击以选择"
            }
        },
        basic_questions: {
            gender: {
                name: "性别",
                placeholder: "点击以选择"
            },
            age_range: {
                name: "年龄段",
                placeholder: "点击以选择"
            },
            mbti: {
                name: "MBTI",
                placeholder: "点击以选择"
            }
        },
        report: {
            save_to_key_not_set: "存储键丢失"
        }
    },
    /** 挑战的翻译 */
    challenge: {
        new_user_tasks: {
            
        }
    },
    /** 用户引导模块API翻译 */
    api: {
        v1_onboarding_get_challenges: {
            name: "批量获取挑战"
        }
    }
}
