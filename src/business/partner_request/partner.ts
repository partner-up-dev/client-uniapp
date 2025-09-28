import { PRRef } from ".";
import { type AccountRef } from "../account";
import { Business } from "../index";


export type PartnerRef = number;

export type PartnerRoleRef = number;

export class Partner extends Business {
  constructor(
    public _id: PartnerRef,
    public partner_request: PRRef,
    public role: PartnerRoleRef,
    public player: AccountRef | null = null,
    public history: AccountRef[] = [],
    public disabled: boolean = false
  ) {
    super();
  }
}
