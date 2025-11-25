import { PRRefV, type PRRef } from '.';
import { nullable, instance, V } from '..';
import * as v from 'valibot';
import { AccountRefV } from '../account';
import { ChatRefV } from '../communication';
import { PartnerRoleRefV } from './partner';
import { HTTPApiClient } from '../http-api';
import { useTranslate } from '@/locale/use';
import { DatetimeV } from '../base';

export type PartnerApplicationRef = number;
export const PartnerApplicationRefV = v.number();


export enum PartnerApplicationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  withdrawn = 'withdrawn',
}


export class PartnerSubApplication extends V.class(v.object({
  role: PartnerRoleRefV,
  rationale: nullable(v.pipe(v.string(), v.minLength(6))),  // 申请理由
})) {

}


const SubApplicationsV = v.pipe(
  v.array(instance(PartnerSubApplication)),
  v.minLength(1),
  v.custom((arr) => {
    const roles = (arr as PartnerSubApplication[]).map(item => item.role);
    const uniqueRoles = new Set(roles);
    return uniqueRoles.size === roles.length;
  }, 'DuplicateRoles')
);

export class PartnerApplication extends V.class(v.object({
  _id: PartnerApplicationRefV,
  created_at: DatetimeV,
  applicant: AccountRefV,
  status: v.enum(PartnerApplicationStatus),
  partner_request: PRRefV,
  chat: ChatRefV,
  eclose_reason: nullable(v.string()),  // 撤销、驳回原因
  sub_applications: SubApplicationsV,
})) {

  static api = new HTTPApiClient<typeof PartnerApplication>({
    modulePrefix: '/partner_request/application',
    dt: useTranslate('partner_request.application').dt,
    fallbackSchema: PartnerApplication,
  });

  static async get_mine(pr_id?: PRRef): Promise<PartnerApplication[]> {
    return this.api.request({
      method: "GET",
      endpoint: '/mine',
      data: { pr_id },
      operation_id: "PRV1GetMyApplications",
      schema: v.array(instance(PartnerApplication)),
    }).then(({ body }) => body.parsed);
  }

}


export class PartnerApplicationForm extends V.formClass(v.object({
  partner_request: PRRefV,
  sub_applications: SubApplicationsV,
})) {

  static api = new HTTPApiClient({
    modulePrefix: "/partner_request/application",
    fallbackSchema: PartnerApplication,
  });

  async submit(): Promise<PartnerApplication> {
    return PartnerApplicationForm.api.request({
      method: "POST",
      endpoint: `/?partner_request_id=${this.partner_request}`,
      operation_id: "PRV2Apply",
      data: this.sub_applications,
    }).then(res => res.body.parsed);
  }

}