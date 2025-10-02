import { PRRefV } from '.';
import { nullable, V } from '..';
import * as v from 'valibot';
import { AccountRefV } from '../account';
import { ChatRefV } from '../chat';
import { PartnerRoleRefV } from './partner';
import { APIClient } from '../api';

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
  v.array(v.instance(PartnerSubApplication)),
  v.minLength(1),
  v.custom((arr) => {
    const roles = (arr as PartnerSubApplication[]).map(item => item.role);
    const uniqueRoles = new Set(roles);
    return uniqueRoles.size === roles.length;
  }, 'DuplicateRoles')
);

export class PartnerApplication extends V.class(v.object({
  _id: PartnerApplicationRefV,
  created_at: v.date(),
  applicant: AccountRefV,
  status: v.enum(PartnerApplicationStatus),
  partner_request: PRRefV,
  chat: ChatRefV,
  eclose_reason: nullable(v.string()),  // 撤销、驳回原因
  sub_applications: SubApplicationsV,
})) {

}


export class PartnerApplicationForm extends V.class(v.object({
  partner_request: PRRefV,
  sub_applications: SubApplicationsV,
})) {

  static api = new APIClient({
    modulePrefix: "/partner_request/application",
    fallbackSchema: PartnerApplication,
  });

  async submit(): Promise<PartnerApplication> {
    return PartnerApplicationForm.api.requestHTTP({
      method: "POST",
      endpoint: `/?partner_request_id=${this.partner_request}`,
      operation_id: "PRV2Apply",
      data: this.sub_applications,
    }).then(res => res.body.parsed);
  }

}