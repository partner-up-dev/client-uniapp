import type { PropType } from "vue";
import { makeBooleanProp, makeStringProp, makeRequiredProp } from "@/utils/props";
import type { PRType } from "@/business/partner_request";
import { PartnerRole, type PartnerRoleRef } from "@/business/partner_request/partner";

// ==================== 组件相关类型定义 ====================

/**
 * 选择模式
 */
export type PartnerPickerMode = "single" | "multiple";

// ==================== 组件 Props 定义 ====================
export const partnerPickerProps = {
  /**
   * 是否显示抽屉
   */
  visible: makeBooleanProp(false),

  /**
   * 搭子请求类型
   */
  prType: makeRequiredProp(String as PropType<PRType>),

  /**
   * 选择模式
   * - single: 单选模式，点击后立即触发 select 事件并关闭
   * - multiple: 多选模式，点击切换选中状态，需要点击确认按钮
   */
  mode: makeStringProp<PartnerPickerMode>("single"),

  /**
   * 已选中的搭子角色 ID
   * - 单选模式: PartnerRoleRef (number)
   * - 多选模式: PartnerRoleRef[] (number[])
   */
  modelValue: {
    type: [Number, Array] as PropType<PartnerRoleRef | PartnerRoleRef[]>,
    default: undefined,
  },

  /**
   * 抽屉高度
   */
  height: makeStringProp("60vh"),
};

// ==================== 组件 Emits 定义 ====================
export const partnerPickerEmits = {
  /**
   * 更新显示状态
   */
  "update:visible": (value: boolean) => true,

  /**
   * 更新选中值
   */
  "update:modelValue": (value: PartnerRoleRef | PartnerRoleRef[]) => true,

  /**
   * 单选模式下选中搭子角色时触发
   */
  select: (partnerRole: PartnerRole) => true,

  /**
   * 多选模式下点击确认按钮时触发
   */
  confirm: (partnerRoles: PartnerRole[]) => true,
};

// ==================== Mock 数据函数 ====================

/**
 * 获取指定搭子请求类型的可用角色列表（Mock）
 * TODO: 后端接口实现后替换为真实 API 调用
 */
export function getAvailablePartnerRoles(prType: PRType): PartnerRole[] {
  // Mock 数据，根据不同类型返回不同的角色
  const mockRoles: Record<PRType, PartnerRole[]> = {
    undefined: [],
    commute: [
      new PartnerRole({
        id: 1,
        name: "司机",
        rule: "负责开车，遵守交通规则，确保乘客安全",
      }),
      new PartnerRole({
        id: 2,
        name: "乘客",
        rule: "按时到达上车地点，支付相应费用",
      }),
    ],
    ride_hailing: [
      new PartnerRole({
        id: 3,
        name: "发起者",
        rule: "负责叫车并支付费用，协调其他乘客",
      }),
      new PartnerRole({
        id: 4,
        name: "拼车者",
        rule: "按约定分摊车费，准时到达上车点",
      }),
    ],
    hitchhiking: [
      new PartnerRole({
        id: 5,
        name: "车主",
        rule: "提供车辆和驾驶服务，确保行车安全",
      }),
      new PartnerRole({
        id: 6,
        name: "搭车者",
        rule: "支付油费或过路费，尊重车主的行车习惯",
      }),
    ],
    moped: [
      new PartnerRole({
        id: 7,
        name: "骑手",
        rule: "负责驾驶电动车，确保乘客安全",
      }),
      new PartnerRole({
        id: 8,
        name: "后座",
        rule: "配合骑手，注意安全，戴好头盔",
      }),
    ],
    travel: [
      new PartnerRole({
        id: 9,
        name: "组织者",
        rule: "负责行程规划和协调，确保旅行顺利",
      }),
      new PartnerRole({
        id: 10,
        name: "参与者",
        rule: "遵守行程安排，分摊费用，共同维护团队和谐",
      }),
      new PartnerRole({
        id: 11,
        name: "摄影师",
        rule: "负责记录旅行精彩瞬间，分享照片给团队",
      }),
    ],
  };

  return mockRoles[prType] || [];
}
