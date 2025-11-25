import { useTranslate } from "@/locale/use";
import { PRRefV, PRType } from ".";
import { AccountRefV } from "../account";
import { HTTPApiClient } from "../http-api";
import { V, nullable, instance } from "../index";
import * as v from 'valibot';
import { computed, ref, watch } from "vue";
import store from "@/store";
import { usePartnerStore } from "@/store/partner_request/partner";


export type PartnerRoleRef = number;
export const PartnerRoleRefV = v.number();

export class PartnerRole extends V.class(v.object({
  id: PartnerRoleRefV,
  name: v.string(),
  rule: v.string(),
})) {
  static api = new HTTPApiClient({
    modulePrefix: '/partner_request/partner_role',
    dt: useTranslate('partner_request.partner_role').dt,
    fallbackSchema: PartnerRole,
  })

  static partnerRoleStore = usePartnerStore(store)

  static async get(id: PartnerRoleRef): Promise<PartnerRole> {
    const cachedRole = this.partnerRoleStore.fetchById(id);
    if (cachedRole) {
      return cachedRole;
    }

    return this.api.request({
      method: "GET",
      endpoint: `/${id}`,
    }).then(({ body }) => {
      const role = body.parsed;
      this.partnerRoleStore.upsert(role);
      return role;
    });
  }

  static use(id?: PartnerRoleRef, role?: PartnerRole) {
    const roleId = ref<PartnerRoleRef | undefined>(id);
    const _role = ref<PartnerRole | undefined>(role);
    const loading = ref(false);

    const partnerRole = computed((): PartnerRole | undefined => {
      if (!_role.value && roleId.value) {
        loading.value = true;
        this.get(roleId.value).then((role) => {
          _role.value = role;
          loading.value = false;
        });
      }
      return _role.value;
    })

    function bindId(idWatch: any) {  // FIXME: idWatch type is the same as vue.watch first param
      watch(idWatch, (val) => {
        roleId.value = val;
        _role.value = undefined;
      });
    }

    return {
      partnerRole, roleId, loading, bindId
    }

  }

  static useAvailableRoles(type: PRType) {
    const _availableRoles = ref<PartnerRole[]>([]);
    const _prType = ref<PRType>(type);
    const loading = ref(false);

    const availableRoles = computed((): PartnerRole[] => {
      if (!_availableRoles.value.length && !loading.value) {
        loading.value = true;
        this.api.request({
          method: "GET",
          endpoint: "",
          data: {
            type: _prType.value
          },
          schema: v.array(instance(PartnerRole)),
        }).then(({ body }) => {
          _availableRoles.value = body.parsed;
          loading.value = false;
        })
      }
      return _availableRoles.value;
    })

    const bindPRType = (typeWatch: any) => {
      watch(typeWatch, (val) => {
        _prType.value = val;
        _availableRoles.value = [];
      });
    }

    return {
      availableRoles, loading, bindPRType
    }
  }
}

export type PartnerRef = number;
export const PartnerRefV = v.number();


export class Partner extends V.class(v.object({
  _id: PartnerRefV,
  partner_request: PRRefV,
  role: PartnerRoleRefV,
  player: nullable(AccountRefV),
  history: v.array(AccountRefV),
  disabled: v.boolean(),
})) {

  get isFree(): boolean {
    return this.player === null;
  }

  get isApplicable(): boolean {
    return !this.disabled && this.isFree;
  }

}


export class PartnerForm extends V.formClass(v.object({
  role: v.optional(PartnerRoleRefV, undefined),
  player: nullable(AccountRefV),
  // TODO disabled
})) { }