/**
 * @abstract PartnerRequest Module's i18n file
 */

import type { named } from "@/locale/types";
import trip from "./trip";
import commute from "./commute";

export default {
  trip: {
    ...trip,
  },
  commute: {
    ...commute,
  },
  geo_filter: {
    reset: "复位",
    filtering_title: "地理筛选",
    no_selection: "点击地图选择筛选区域",
    route_selected: "已选择路线",
    poi_selected: "已选择地点",
    area_selected: "已选择区域",
    map_error: "地图加载失败",
    location_error: "定位失败",
    select_an_element: "浏览地图，选择一个元素",
  },
  title: {
    default: "搭子请求",
    specific_content: {
      ride_hailing: {
        route: "路线信息"
      }
    }
  },
  type: {
    null: "未知搭子",
    undefined: "未知搭子",
    ride_hailing: "网约车搭子",
    travel: "旅游搭子",
    trip: "出行搭子",
    commute: "通勤搭子",
    moped: "电驴搭子",
    hitchhiking: "便车搭子",
  },
  status: {
    joinable: "可加入",
    ready: "已就绪",
    executing: "执行中",
    closing: "结算中",
    closed: "已关闭",
    draft: "未发布"
  },
  "status_desc": {
    "waiting_for_partners": "匹配到搭子会立马通知您",
    "waiting_for_execution": "已组成搭子，起草并签署契约",
    "contract_signed": "所有搭子已签署契约，等待执行",
    "order_created": "网约车订单已创建",
    "executing": "执行过程受契约保护",
    "closing": "根据契约进行结算",
    "closed": "完全关闭",
    "draft": "快去发布吧"
  },
  operation: {
    favorite: "想搭",
    unfavorite: "取消想搭",
    apply: "搭一把",
    view_application: "查看申请",
    more: {
      title: "更多操作",
      stop_waiting_for_partners: "停止寻找搭子"
    },
    stop_waiting_for_partners: {
      modal_desc: "这意味着其它人无法继续申请该搭子请求（未审批的申请将被驳回），而你们将可以签署契约并进行相关活动",
      disabled: "冲突或无权限"
    }
  },
  detail: {
    header: {
      favorite: "关注",
      favorited: "已关注",
    },
    drawer: {
      apply: "申请加入",
      submit_apply: "提交申请",
      add_role: "申请更多角色",
      application_approving: "加入申请审核中",
      application_rejected: "加入申请被拒绝",
    },
    partners: {
      title: "搭子角色",
    },
    route: {
      title: "路线"
    },
    application_chat: {
      title: "沟通"
    },
    sub_applications: {
      title: "申请的角色",
      submitted_at: "提交于"
    },
    application_eclose: {
      title_rejected: "驳回原因",
      title_withdrawn: "撤回原因",
    }
  },
  partner: {
    status: {
      playing: "扮演",
      free: "等待扮演",
      playing_by_you: "由你扮演"
    },
    rationale_editor: {
      placeholder: "申请该角色的补充说明"
    }
  },
  apply_form: {
    title: "加入搭子请求",
    subtitle: "每个搭子角色有对应的义务和权利，扮演即成为搭子。",
  },
  "specific_content": {
    "ride_hailing_config": {
      "estimated_price": "综合预估价格",
      "preference": "叫车预设",
      "simple_estimated_price_desc": "预计",
      "estimated_price_null": "无法计算"
    },
    "ride_hailing_type": {
      "estimated_price": "预计",
      "ride_type": {
        "normal": "专车",
        "fast": "快车"
      },
      "platform": {
        "didi": "滴滴",
        "feizhu": "飞猪"
      }
    }
  },
  "execution": {
    "title": "执行",
    "contract": {
      "title": "契约",
      "view": "查看契约",
      "create": "起草契约",
      "edit": "编辑契约",
      "create_hint": "你现在可以创建或者发布契约，为执行准备"
    },
  },
  "discover_more": "发现更多",
  /**
   * @name 搭子请求编辑器组件的翻译
   */
  editor: {
    "stage1": {
      "confirm": "开始创建搭子请求",
      "partner_request_type": "选择搭子请求类型",
      "partner_request_draft": "或者从草稿继续",
      "progress_bar": {
        "start": "开始",
        "detail": "详情",
        "done": "发布"
      },
      "load_cached_form": "发现存档，点击继续填写",
      "load_from_cache": "从自动存档继续"
    },
    common_editor: {
      title: "基本信息"
    },
    partners_editor: {
      title: "搭子角色"
    }
  },
  /**
   * @name 搭子请求一般内容编辑器组件的翻译
   */
  common_editor: {
    title: {
      title: "标题",
      placeholder: "搭子活动的关键内容"
    },
    introduction: {
      title: "简介",
      placeholder: "其它说明与补充"
    },
  },
  /**
   * @name 搭子请求草稿选择器组件的翻译
   */
  draft_picker: {
    placeholder: {
      no_drafts: "没有草稿",
    }
  },
  /**
   * @name 搭子请求类型展示组件的翻译
   */
  type_display: {
    title: {
      trip: "出行搭子",
      travel: "旅游搭子",
      commute: "通勤搭子",
      ride_hailing: "网约车搭子",
      moped: "电驴搭子",
      hitchhiking: "便车搭子"
    },
    description: {
      trip: "通勤、去地铁站、火车站，拼个电驴/网约车/顺风车",
      travel: "旅游是延长生命的艺术，找个搭子轻松又划算",
      commute: "通勤也可以省钱又舒适，做个精致上班族",
      ride_hailing: "打车一起坐，价格直砍半",
      moped: "电瓶车两个座，短途最佳",
      hitchhiking: "我开车，找个搭子省点油钱"
    }
  },
  /**
   * @name 搭子请求创建开始页面的翻译
   */
  create_start: {
    headline: {
      1: "创建搭子请求",
      2: "系统帮找，省心省力"
    },
    l1_type_picker: {
      title: "找什么搭子",

    },
    continue_from_draft: {
      title: "从草稿继续"
    },
    continue_from_cache: {
      title: "从自动保存继续"
    }
  },
  /**
   * @name 搭子请求创建结束页面的翻译
   */
  create_end: {
    title: {
      undefined: "发布搭子请求",
      travel: "发布旅游搭子请求",
      ride_hailing: "发布网约车搭子请求",
      commute: "发布通勤搭子请求",
      moped: "发布电驴搭子请求",
      hitchhiking: "发布便车搭子请求"
    },
    after_publish: {
      head: {
        title: "发布成功！"
      },
      next: {
        title: "接下来",
        description: "算法将自动匹配合适的搭子，您将收到搭子申请通知，请及时审批"
      },
      share: {
        title: "加快速度",
        description: "分享该搭子请求到群聊、朋友圈、小红书等，提升曝光加速匹配",
        operation: "一键分享"
      },
      stop: {
        title: "停止寻找",
        description: "当您认为找到足够的搭子后，可在详情页面停止寻找搭子"
      }
    },
    operations: {
      publish: "发布",
      save: "存稿",
      share: "一键分享",
      view: "查看详情",
      discover: "探索搭子"
    },
    publishing_notice: {
      0: '创建群聊中...',
      1: '生成契约中...'
    },
    publish: {
      invalid_id: "无效的搭子请求ID",
      success: "成功",
      failed_to_save: "保存失败",
      failed_to_create: "创建失败",
    },
    save: {
      invalid_form_type: "无效的搭子类型"
    },
    on_load: {
      load_form_from_cache: {
        failed: "自动存稿加载失败"
      }
    }
  },
  /**
   * @name 出行搭子请求创建页面的翻译
   */
  create_trip: {
    trip_purpose: {
      title: "您的出行目的是"
    },
    transportation: {
      title: "选择期望的出行方式"
    }
  },
  /**
   * @name 沉浸式创建搭子请求组件的翻译
   */
  immersive_create: {
    operations: {
      next: {
        text: "下一步",
      },
      skip_all: {
        text: "直接填表",
        create_failed: "创建失败"
      },
      finish: {
        text: "检查并发布",
        l2type_not_selected: "类型丢失"
      }
    },
    l2type_picker: {
      title: "选择二级类型以继续"
    }
  },
  timeline: {
    title: "进展"
  },
  timeline_item: {
    "draft": {
      title: "草稿",
      description: "搭子请求处于草稿状态，需要完善信息后发布",
      actions: {
        edit: "编辑",
        publish: "发布",
        delete: "删除"
      }
    },
    "joinable": {
      title: "可加入",
      description: "其它用户可以申请加入该搭子请求\n系统会为您匹配合适的搭子",
      actions: {
        approve_applications: "审批申请",
        ready: "已就绪",
        share: "分享"
      }
    },
    "ready": {
      title: "已就绪",
      description: "搭子已组成，可以开始执行活动",
      actions: {
        start: "开始",
        view_contract: "查看契约",
        cancel: "取消"
      }
    },
    "performing": {
      title: "执行中",
      description: "搭子活动正在进行中",
      actions: {
        view_progress: "查看进度",
        contact: "联系搭子",
        report: "举报"
      }
    },
    "settling": {
      title: "结算中",
      description: "活动已完成，正在进行费用结算",
      actions: {
        view_settlement: "查看结算",
        confirm: "确认",
        dispute: "申诉"
      }
    },
    "closed": {
      title: "已关闭",
      description: "搭子请求已完成并关闭",
      actions: {
        view_summary: "查看总结",
        rate: "评价",
        share: "分享"
      }
    },
    "cancelled": {
      title: "已取消",
      description: "搭子请求已被取消",
      actions: {
        view_reason: "查看原因",
        repost: "重新发布"
      }
    },
    "merged": {
      title: "已合并",
      description: "搭子请求已与其他请求合并",
      actions: {
        view_merged: "查看合并后的请求"
      }
    }
  },
  /** 搭子请求模块API翻译 */
  api: {
    v1_partner_request_get_list: {
      name: "获取搭子请求列表",
    }
  }
}
