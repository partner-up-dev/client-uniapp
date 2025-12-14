// partner_request/partner_role Store Module

import { defineStore } from "pinia";
import { type PartnerRoleRef, PartnerRole } from "@/business/partner_request/partner";


export interface PartnerState {
  roles: {
    [key: PartnerRoleRef]: PartnerRole
  }
}


export const usePartnerStore = defineStore('partner_request/partner', {
  unistorage: true,
  state: (): PartnerState => {
    return {
      roles: {}
    }
  },
  getters: {
    fetchRoleById(state: PartnerState) {
      return (role_id: PartnerRoleRef): PartnerRole | undefined => {
        const data = state.roles[role_id];
        if (!data) return undefined;
        return PartnerRole.parse(data);
      };
    }
  },
  actions: {
    upsert(role: PartnerRole) {
      if (!role.id) return;
      this.roles[role.id] = role;
    }
  }
})