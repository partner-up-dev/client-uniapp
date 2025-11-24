/**
 * @name 搭子请求表单辅助函数
 * @description 提供搭子请求表单的初始化和转换功能
 */

import { PRType } from "@/business/partner_request";
import { PartnerRequest, PartnerRequestForm } from "@/business/partner_request/base";

/**
 * @name 获取空的搭子请求编辑器表单
 * @description 根据搭子请求类型创建初始化的表单数据
 */
export function get_partner_request_editor_form(type: PRType): PartnerRequestForm {
  return PartnerRequestForm.parse({
    title: null,
    introduction: null,
  });
}

/**
 * @name 从搭子请求实例获取编辑器表单
 * @description 将已有的搭子请求转换为可编辑的表单数据
 */
export function get_partner_request_editor_form_from_partner_request(
  pr: PartnerRequest
): PartnerRequestForm {
  return PartnerRequestForm.parse({
    title: pr.title,
    introduction: pr.introduction,
  });
}

/**
 * @name 搭子请求编辑内容联合类型
 * @description 目前只支持基础表单，未来可扩展以支持类型特定的字段
 */
export type PartnerRequestEditableContentUnion<T extends PRType = PRType> = PartnerRequestForm;
