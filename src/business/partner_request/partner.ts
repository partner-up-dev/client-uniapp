import { useTranslate } from "@/locale/use";
import { PRRefV } from ".";
import { AccountRefV } from "../account";
import { APIClient } from "../api";
import { V } from "../index";
import * as v from 'valibot';
import { computed, ref } from "vue";


export type PartnerRoleRef = number;
export const PartnerRoleRefV = v.number();

export class PartnerRole extends V.class(v.object({
  id: PartnerRoleRefV,
  name: v.string(),
  rule: v.string(),
})) {
  static api = new APIClient({
    modulePrefix: '/partner_request/partner_role',
    dt: useTranslate('partner_request.partner_role').dt,
    fallbackSchema: PartnerRole,
  })

  static get(id: PartnerRoleRef): Promise<PartnerRole> {
    return this.api.requestHTTP({
      method: "GET",
      endpoint: `/${id}`,
    }).then(({ body }) => body.parsed);
  }

  static use(id: PartnerRoleRef) {
    const roleId = ref<PartnerRoleRef>(id);
    const _role = ref<PartnerRole>();

    const partnerRole = computed((): PartnerRole | undefined => {
      if (!_role.value) {
        this.get(roleId.value).then((role) => {
          _role.value = role;
        });
      }
      return _role.value;
    })

    return {
      partnerRole, roleId
    }

  }
}

export type PartnerRef = number;
export const PartnerRefV = v.number();


export class Partner extends V.class(v.object({
  _id: PartnerRefV,
  partner_request: PRRefV,
  role: PartnerRoleRefV,
  player: v.nullable(AccountRefV),
  history: v.array(AccountRefV),
  disabled: v.boolean(),
})) {
}


