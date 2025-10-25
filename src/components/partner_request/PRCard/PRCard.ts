import type { PropType } from "vue";
import { PRType, PRStatus, type PRRef } from "@/business/partner_request";
import { PartnerRequest } from "@/business/partner_request/base";
import { type AccountRef } from "@/business/account";
import { useTranslate } from "@/locale/use";

const { dt } = useTranslate('partner_request');

// ==================== 组件 Props 定义 ====================
export const prCardProps = {
  /** 搭子请求数据（与 prId 二选一）*/
  partnerRequest: {
    type: Object as PropType<PartnerRequest>,
    required: false,
  },
  /** 搭子请求 ID（与 partnerRequest 二选一）*/
  prId: {
    type: Number as PropType<PRRef>,
    required: false,
  },
  /** 卡片类型 */
  type: {
    type: String as PropType<"Explore" | "Join" | "Draft">,
    default: "Explore",
  }
};

// ==================== 组件 Emits 定义 ====================
export const prCardEmits = {
  /** 点击卡片 */
  cardClick: (partnerRequest: PartnerRequest) => true,
  /** 点击加入按钮 */
  joinClick: (partnerRequest: PartnerRequest) => true,
  /** 点击复制按钮 */
  copyClick: (partnerRequest: PartnerRequest) => true,
  /** 点击收藏按钮 */
  bookmarkClick: (partnerRequest: PartnerRequest) => true,
};

// ==================== 模拟数据生成函数 ====================
/**
 * 生成模拟的搭子请求数据
 * @returns 模拟的PartnerRequest对象
 */
export function generateMockPartnerRequest(): PartnerRequest {
  return PartnerRequest.parse({
    _id: 103,
    created_at: new Date(),
    created_by: "f2db3156-b3df-4bc7-a48e-22fd77a6616c",
    type: PRType.RideHailing,
    status: PRStatus.Joinable,
    title: "搭子请求主要内容概览",
    introduction: "搭子请求次要内容概览",
    chat: null,
    contract: 12345,
  });
}

/**
 * 生成模拟的参与者数据
 * @param count 参与者数量
 * @returns 模拟的AccountRef数组
 */
export function generateMockPartners(count: number = 3): AccountRef[] {
  return Array.from({ length: count }, (_, index) =>
    `f2db3156-b3df-4bc7-a48e-22fd77a6616c`
  );
}

/**
 * 格式化搭子类型显示文本
 * @param type 搭子类型
 * @returns 格式化后的类型文本
 */
export function formatPRType(type: PRType): string {
  return dt(`type.${type}`) || "未知";
}