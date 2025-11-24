import type { named } from "./types";
import base from "./zh-Hans/base";
import ride_hailing from "./zh-Hans/partner_request/ride_hailing";
import split_the_bill from "./zh-Hans/split_the_bill";
import account from "./zh-Hans/account";
import commute from "./zh-Hans/partner_request/commute";
import partner_request from "./zh-Hans/partner_request";
import onboarding from "./zh-Hans/onboarding";
import explore from "./zh-Hans/explore";


export default {
    common: {
        /** @name 卡片组件的翻译 */
        card: {
            select: {
                select: "选中",
                deselect: "取消选中"
            }
        },
        /** @name 单元格组件的翻译 */
        cell: {
            placeholder: {
                empty: "此值为空",
                picker: "点击以选择",
                input: "点击以输入"
            }
        },
        /** @name 字段组件的翻译 */
        field: {
            placeholder: {
                empty: "此值为空",
                picker: "点击以选择",
                input: "点击以输入"
            }
        },
        loading: "加载中",
        "load_more": {
            "more": "加载更多",
            "loading": "加载中",
            "no_more": "没有更多了"
        },
        "picker": {
            "cancel": "取消",
            "confirm": "确认",
            "not_selected": "未选择"
        },
        action_sheet: {
            cancel: "取消"
        },
        editor: {
            confirm: "确认",
            cancel: "取消",
            submit: "提交",
            create: "创建",
            save: "保存"
        },
        "toast": {
            "max": "已达到最大值",
            "login_first": "请先登录",
            "internal_error": "逻辑错误，请报告",
            "network_error": "网络错误",
            "param_missing": "参数丢失",
            uploading: "上传中",
            upload_failed: "上传失败",
            saved: "保存成功",
            created: "创建成功",
            submitted: "提交成功",
            save_failed: "保存失败",
            create_failed: "创建失败",
            loading_form: "加载表单中",
        },
        "share": {
            "moments": "朋友圈",
            "wechat": "微信聊天"
        },
        "error": {
            "params_missing": "参数丢失",
            "image_load": "加载失败",
            network_error: "网络错误",
        },
        "personal_pronoun": {
            "you": "你",
            "me": "我",
            "ta": "TA"
        },
        "placeholder": {
            "empty": "空"
        },
        status_tip: {
            network: "网络错误，请重试",
            empty: "暂无内容",
            panic: "不正确的操作"
        },
        button: {
            confirm: "确认",
            save: "保存",
            cancel: "取消",
        },
        form: {
            invalid: "表单填写有误",
            required: '此项为必填',
            radio: {
                required: '请选择至少一个选项',
                out_of_range: '错误的选项'
            },
            list: {
                max: ({ named }: { named: named }) => `最多 ${named('value')} 项`,
                min: ({ named }: { named: named }) => `最少 ${named('value')} 项`,
                duplicated: '不能重复',
                length_limit: ({ named }: { named: named }) => `长度限制为 ${named('min')}~${named('max')}`,
            },
            number: {
                max: ({ named }: { named: named }) => `最大值为 ${named('value')}`,
                min: ({ named }: { named: named }) => `最小值为 ${named('value')}`,
                type_incorrect: "类型不正确",
                range_limit: ({ named }: { named: named }) => `范围限制为 ${named('min')}~${named('max')}`,
                positive: "必须为正数",
                not_zeroable: "不能为0",
                decimal_limit: ({ named }: { named: named }) => `小数点后最多 ${named('value')} 位`,
                money: "无效的金额"
            }
        }
    },
    pages: {
        title: {
            home: "发现搭子",
            notification: "通知",
            request: "我的搭子请求",
            me: "我的",
            partner_request_detail: "搭子请求",
            partner_request_edit: "编辑搭子请求",
            chat: "评论区",
            profile: "个人资料",
            ride_hailing_order: "网约车搭子请求执行辅助"
        }
    },
    api: {
        report: {
            request_error: "请求失败",
            response_error: "返回报错"
        },
        "toast": {
            "fail": "请求发送失败",
            "success": "请求成功",
            "409": "冲突或重复",
            "404": "不存在",
            "403": "没有权限",
            "401": "未登录",
            "500": "服务器错误",
            "451": "内容违规"
        },
        "partner_request": {
            "V1PartnerRequestCreate": {
                "toast": {
                }
            },
            "V1PartnerRequestEdit": {
                "toast": {
                    "404": "搭子请求不存在"
                }
            },
            "V1PartnerRequestGet": {
                "toast": {
                    "404": "找不到搭子请求"
                }
            },
            "V1PartnerRequestPublish": {
                "toast": {
                    "404": "搭子请求不存在",
                    "409": "冲突！已发布"
                }
            },
            "V1PartnerRequestApply": {
                "toast": {
                    "404": "搭子请求不存在",
                    "409": "已申请或被封锁"
                }
            },
            "V1PartnerRequestUnapply": {
                "toast": {
                    "404": "搭子请求不存在",
                    "409": "已拒绝或已同意"
                }
            },
            "V1PartnerRequestApprovePartnerApplication": {
                "toast": {
                    "404": "搭子请求不存在",
                    "409": "已撤回或已拒绝"
                }
            },
            "V1PartnerRequestRejectPartnerApplication": {
                "toast": {
                    "404": "搭子请求不存在",
                    "409": "已撤回或已同意"
                }
            },
            "V1PartnerRequestStopWaitingForPartners": {
                "toast": {
                    "404": "搭子请求不存在",
                    "409": "已经停止或其它"
                }
            },
            "V1PartnerRequestSubmitRideHailingOrderProof": {
                "toast": {
                    "409": "已经提交或其它"
                }
            }
        },
        message: {
            V1ChatApproveApproval: {
                toast: {
                    409: "已通过/驳回或过期",
                    403: "不是审批者"
                }
            },
            V1ChatRejectApproval: {
                toast: {
                    409: "已通过/驳回或过期",
                    403: "不是审批者"
                }
            }
        },
        split_the_bill: {
            409: {
                modal_title: "冲突！",
                modal_content: "下列是可能的原因：\n1. 所属搭子请求未停止寻找搭子 \n2. 已经提交 \n3. 账单没有被提交到搭子请求中 \n4. 所属搭子请求已经关闭"
            }
        },
    },
    "storage": {
        "toast": {
            "save_failed": "本地缓存失败",
            "load_failed": "获取缓存失败"
        }
    },
    "feed": {
        "title": "搭子请求动态",
        "soft_requirements": {
            "title": "希望你"
        },
        "strict_requirements": {
            "title": "请你务必"
        },
        "metadata": {
            "time_loss": {
                "day": "天前",
                "hour": "小时前",
                "minute": "分钟前",
                "less_than": "小于",
                "just_now": "刚刚"
            }
        },
        "introduction": {
            "ellipsis": "......"
        },
        "ride_hailng_route": {
            "time_loss": {
                "less": "提前",
                "more": "推迟",
                "unit": "min"
            },
            "distance_loss": {
                "less": "少",
                "more": "多",
                "unit": "km"
            }
        }
    },
    "notification": {
        "title": "评论",
        "direct_message": "对我的评论",
        "partner_request": "我的搭子请求评论",
        "placeholder": {
            "no_partner_request_chat": "暂无搭子请求评论，快去搭一把/创建搭子请求吧！",
            "no_direct_message_chat": "暂无对我的评论"
        }
    },
    "chat": {
        "status": {
            "ongoing": "进心中",
            "closed": "已关闭"
        },
        title: {
            default: "评论区",
            direct_message: "私信"
        },
        "thread_bar": {
            "placeholder": "暂无子评论区"
        },
        "type": {
            "partner_request": "搭子请求评论区",
            "direct_message": "私信",
            "partner_application": "搭子申请"
        },
        message_bar: {
            function_panel: {
                image: "图片",
                file: "文件",
                location: "位置",
                route: "路线",
                agenda: "日程",
            },
            "send": "评论"
        },
        "partner_application": {
            "desc": "我希望和你们\"搭一把\"，请审核我的申请！",
            "view": "[查看申请]",
            "title": "搭子申请审核",
            "description": {
                "applicant": {
                    "undefined": "加载错误",
                    "waiting_for_approving": "搭子申请已经提交，你可以先介绍一下自己",
                    "approved": "🎊你们已经是搭子啦！",
                    "rejected": "😥很遗憾你们没有成为搭子，我们会继续努力为您寻找的",
                    "withdrawn": "😥很遗憾你们没有成为搭子，我们会继续努力为您寻找的"
                },
                "admin": {
                    "undefined": "加载错误",
                    "waiting_for_approving": "你是这个搭子请求的管理员，审批权在你手上。你们可以在这个子群聊中互相了解与商讨",
                    "approved": "🎊你们现在是搭子啦！可以开始执行搭子了！",
                    "rejected": "😥很遗憾你们没有成为搭子，我们会继续努力为您寻找的",
                    "withdrawn": "申请人已撤回"
                },
                "non_admin": {
                    "undefined": "加载错误",
                    "waiting_for_approving": "你是本搭子请求的成员，你可以在本子群聊中一起探讨是否通过此申请，但由发起者最终决定",
                    "approved": "🎊你们已经是搭子啦！",
                    "rejected": "😥很遗憾你们没有成为搭子，我们会继续努力为您寻找的",
                    "withdrawn": "申请人已撤回"
                }
            },
            "operation": {
                "loading": "处理中...",
                "withdraw": {
                    "waiting_for_approving": "撤回申请",
                    "withdrawn": "已撤回",
                    "rejected": "已被拒绝",
                    "approved": "已被通过"
                },
                "reject": {
                    "waiting_for_approving": "驳回申请",
                    "rejected": "不合适",
                    "approved": "已通过",
                    "withdrawn": "已被撤回"
                },
                "approve": {
                    "waiting_for_approving": "搭一把",
                    "approved": "现在就执行",
                    "rejected": "已拒绝",
                    "withdrawn": "已被撤回"
                }
            }
        }
    },
    message: {
        content_type: {
            plain: "纯文本",
            image: "图片",
            file: "文件",
            location: "位置",
            route: "路线",
            agenda: "日程",
            unknown: "暂不支持的消息类型"
        },
        friendly_content: {
            new_member: ({ named }) => `新成员 ${named('nickname')} 加入`,
            partner_application: `有新的搭子申请`,
        }
    },
    approval: {
        status: {
            pending: "审批中",
            approved: "通过",
            rejected: "驳回"
        },
        operation: {
            approve: "同意",
            reject: "驳回",
            approved: "你已同意",
            rejected: "你已驳回"
        },
        type: {
            prefix: "类型：",
            one_veto: "一票否决",
            half: "半数通过",
        },
        default: {
            title: "审批"
        },
        hint: {
            need_their_approve: "还需要他们的同意",
            has_approved: "已经同意",
        }
    },
    partner_request: {
        ...partner_request
    },
    contract: {
        "operation": {
            "sign": {
                "signed": "查看签署",
                "sign": "签署契约",
                "title": "签署情况",
                "confirm": "确认签署",
                "tips": "请仔细检查契约内容，契约有法律效力",
                "who_has_signed": "他们已经签署：",
            }
        },
        "metadata": {
            "title": {
                "part1": "搭子请求",
                "part2": "的契约"
            },
            "allow_resign": {
                "title": "毁约重签：",
                "true": "允许",
                "false": "不允许",
                "partners_change": "成员变更",
                "content_change": "内容变更",
            },
            "status": {
                "amending": "起草中",
                "pending": "待签署",
                "signing": "签署中",
                "signed": "签署完毕",
                "executing": "执行中",
                "closing": "结算中",
                "closed": "已关闭"
            },
            "datetime": {
                "created_at": "创建于",
                "updated_at": "更新于"
            }
        },
        "content": {
            "title": "具体条款",
            "divider": {
                "stage": "阶段",
                "clause": "条款"
            },
            "stage": {
                "execution": "执行",
                "closing": "结算"
            }
        },
        "clause": {
            "name": {
                "title": "条款",
                "ride_hailing_config": "网约车叫车配置",
                "checkout": "结账配置",
                "strict_requirements": "基本要求",
                "soft_requirements": "个性化要求"
            },
            "validate_at": {

            },
            "validation_result": {
                "fail": "完全违约",
                "success": "正常履行",
            },
            "status": {
                "pending": "待检查",
                "validated": "校验完毕",
                "validating": "检查中",
            },
            "executors": "执行人",
            "no_executors": "未指定",
            "obligation": {
                "title": "义务",
                "getter": {
                    "get_partner_request_strict_requirements": "基本要求",
                    "get_partner_request_soft_requirements": "个性化要求"
                }
            },
            "default": {
                "title": "处罚"
            }
        }
    },
    contract_legal_document: {
        title: {
            page: "契约：法律文件",
        },
        operation: {
            view_legal_document: {
                title: "查看合同",
            },
            sign_legal_document: {
                label: {
                    need_my_signature: {
                        text: "点击签名",
                        icon: "signature",
                        icon_prefix: "partnerup-iconfont"
                    },
                    i_have_signed: {
                        text: "你已签名",
                        icon: "check-circle",
                        icon_prefix: 'wd-icon'
                    },
                    effecting: {
                        text: "生效中",
                        icon: "file-done",
                        icon_prefix: "partnerup-iconfont"
                    },
                    closed: {
                        text: "已关闭",
                        icon: "file-done",
                        icon_prefix: "partnerup-iconfont"
                    }
                },
                desc: {
                    need_my_signature: "签名指对当前合同的内容进行数字签名（使用平台颁发的个人数字证书），这类签名具备法律效力",
                    i_have_signed: "",
                    effecting: ""
                },
                other: {
                    signed_parties: {
                        label: "他们已经签名："
                    },
                    not_signed_parties: {
                        label: "他们还未签名："
                    },
                    effecting_help: {
                        label: "接下来做什么？"
                    }
                },
                button: {

                },
                soter_authentication: {
                    auth_content: "验证你的身份以保证签名的合法性"
                },
                toast: {
                    soter_auth_failed: "生物认证失败",
                    unexpected_error: "未知错误",
                    sign_loading: "签名中...",
                    sign_success: "签名成功",
                    sign_failed: "签名失败",
                    soter_not_supported: "您的设备不支持生物认证。我们会加快对此类设备的支持，感谢您的理解与支持。"
                }
            }
        },
        hero: {
            serial_number: ({ named }: { named: named }) => `No.${named('contract_id')}`,
            desc: {
                part1: "契约是搭子请求的符合法律规范、具有法律效力的表述。通过法律约束搭子的行为，是搭子请求安全、合规、可信的",
                part2: "最后防线"
            }
        },
        toast: {
            open_document_failed: "打开失败，已经保存到本地",
            save_document_failed: "文件保存失败"
        }
    },
    clause: {

    },
    clause_performers_editor: {
        new_performers: {
            title: "新的履行人列表"
        }
    },
    clause_quick_actions: {
        performers: {
            cell_title: {
                null: "条款履行人",
                route: "打车负责人"
            },
            label: "点击编辑条款履行人"
        },
        clause_content: {
            title: "条款内容",
            label: "点击查看'合同'"
        }
    },
    account: {
        ...account
    },
    editor: {
        partner_request_type: {
            title: '选择搭子请求类型',
            toast: {
                not_selected: "未选择类型"
            }
        },
        partner_request: {
            title: {
                metadata: "元数据",
                common_content: "更多配置",
                title: "标题",
                introduction: "简介",
                strict_requirements: "基本要求",
                soft_requirements: "个性化要求",
            },
            validation_messages: {
                route: {
                    location_required: "出发地、途经点与目的地不能为空",
                    datetime_required: "出发时间不能为空",
                    datetime_order: "时间不符合顺序",
                    datetime_earilier_than_now: "出发时间不能早于当前时间"
                }
            },
            "collapse": {
                "metadata": "元数据",
                "common_content": "更多配置"
            },
            "toast": {
                "created": "已保存为草稿",
                "updated": "已保存",
                "invalid_form": "数据填写有误",
                "cahce_failed": "自动保存失败",
                "stop_waiting_for_partners_first": "请先停止寻找搭子",
                "publish_success": "发布成功！",
                "publish_failed": "发布失败"
            },
            "tips": {
                "stage3": {
                    "publish": "一切就绪，快开始寻找你的搭子吧！✨",
                    "published": "🎉发布成功！一键分享，广而告之！"
                }
            },
            "operation": {
                "go_back": "上一步",
                "save_to_draft": "存稿",
                "confirm": "完成",
                "publish": "发布，就现在",
                "publishing": "发布中...",
                "published": "查看请求",
                "stop_waiting_for_partners": "停止寻找搭子",
                "already_stop_waiting_for_partners": "已停止",
                "ride_hailing_order": "前往打车",
                "view_ride_hailing_order": "查看网约车订单"
            },
            "metadata": {
                "title": "标题",
                "introduction": "简介",
                "placeholder": {
                    "title": "一目了然",
                    "introduction": "直观快速地吸引别人和你组成搭子！"
                }
            },
            "common_content": {
                'strict_requirements': "基本要求",
                "soft_requirements": "个性化要求",
                "tips": {
                    "strict_requirements": "基本要求是更强烈的、更重要的要求",
                    "soft_requirements": "个性化要求即软要求，是如此更好的意思"
                }
            },
            "share": {
                "comeon": "快来跟我\"搭一把\""
            },
            "modal": {
                "stop_waiting_for_partners": "这将会驳回所有未审核的搭子申请，你将可以创建并发布契约"
            }
        },
        route: {
            toast: {
                max_route_item: "已达到最大路线节点数",
                min_route_item: "至少需要两个路线节点",
            },
            placeholder: {
                friendly_address: {
                    default: "地址昵称",
                    departure: "点击以选择出发地",
                    arrival: "点击以选择目的地",
                    passby: "点击以选择途经地"
                },
            },
            "cancel": "取消",
            "pick_time": "选择时间",
            "pick_location": "选择地点",
            "confirm": "确定",
            "datetime_popup_tips": "选择你在该地点的期望时间以及可以容忍的时间误差",
            "label": {
                "address": "详细地址",
                "friendly_address": "地址昵称"
            }
        },
        route_item_location: {
            title: {
                friendly_address: "地址昵称",
                address: "详细地址",
            },
            placeholder: {
                friendly_address: "你可以自定义地点昵称",
                address: "点击以选择",
            },
            description: {
                friendly_address: "对地点的简写，加快辨识速度；如广外南、华师生活南"
            },
            operation: {
                choose_location: "选择地点"
            },
            toast: {
                confirm_fail_for_get_location: "保存失败，检查网络后重试"
            },
            validation_messages: {
                required: "地址是必填的，请选择"
            }
        },
        route_item_datetime: {
            title: {
                datetime: "时间",
                time_loss: "时间误差"
            },
            placeholder: {
                datetime: "请选择时间",
                time_loss: "调整可接受的时间误差"
            },
            description: {
                datetime: "在该地点的期望时间；出发时间是必须设置的",
                time_loss: "可以容忍的最大时间误差"
            },
            validation_messages: {
                required: "出发地时间为必填"
            }
        },
        plain_message: {
            validation_messages: {

            }
        },
        "requirements": {
            "add_requirement": "添加要求"
        },
    },
    account_picker: {
        operation: {
            confirm: "确认",
            cancel: "取消"
        }
    },
    ...split_the_bill,
    ride_hailing: { ...ride_hailing },
    base: { ...base },
    /**
     * @name 首页的翻译
     */
    home: {
        welcome: {
            greet: {
                morning: "早上好,",
                noon: "中午好,",
                afternoon: "下午好,",
                evening: "晚上好,",
            },
            nickname: "请登录",
            emoji: "👋",
        },
        /** 创建搭子请求块 */
        cpr: {
            title: "想找什么搭子？",
            waiting: {
                title: "正在为你寻找搭子"
            }
        },
        /** 发现搭子请求 */
        prd: {
            title: "大家在找什么搭子"
        },
        to_guide: {
            title: "初来乍到？"
        }
    },
    /**我的页面翻译 */
    me: {
        title: "我的",
        welcome: "欢迎来到搭一把",
        user: {
            joined_at: "加入",
            placeholder_nickname: "登录搭一把"
        },
        my_partner_requests: {
            title: "我的搭子请求",
            subtitle: "查看和管理你发起的搭子请求"
        },
        nickname: {
            placeholder: '输入昵称'
        },
        actions: {
            login: "登录",
            edit_profile: "编辑资料",
            logout: "退出登录",
            help: "帮助"
        },
        logout: {
            success: "登出成功"
        },
        edit_card: {
            title: "个人信息编辑",
            fields: {
                bio: {
                    title: "个人简介",
                    placeholder: "介绍一下自己吧"
                },
                gender: {
                    title: "性别",
                    placeholder: "点击以选择"
                },
                mbti: {
                    title: "MBTI",
                    placeholder: "点击以选择"
                }
            }
        },
        my_lists: {
            partner_requests: {
                title: "我的搭子请求",
                description: "我发布的、参与的、收藏的",
                looking_for_partners: "正在寻找搭子"
            },
            split_bills: {
                title: "我的分账账单",
                description: "",
                action_required: "需要操作！"
            }
        }
    },
    onboarding: {
        ...onboarding
    },
    explore: {
        ...explore
    }
}
