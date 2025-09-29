import { Partner } from "./partner";
import { APIClient } from "../api";
import { useTranslate } from "@/locale/use";
import { computed, ref, watch } from "vue";
import { V } from "../index";
import { type PRRef, PRRefV, PRType, PRStatus, PRL1Type, PRType2L1Type } from ".";
import * as v from 'valibot';

export class PartnerRequest extends V.class(v.object({
  _id: PRRefV,
  created_at: v.pipe(
    v.union([v.string(), v.number(), v.date()]),
    v.transform((i) => i instanceof Date ? i : new Date(i))
  ),
  created_by: v.string(),
  type: v.enum(PRType),
  status: v.enum(PRStatus),
  title: v.nullable(v.string()),
  introduction: v.nullable(v.string()),
  chat: v.nullable(v.number()),
  contract: v.number(),
})) {

  static api = new APIClient({
    modulePrefix: '/partner_request',
    dt: useTranslate('partner_request').dt,
    fallbackSchema: PartnerRequest,
  })

  static getL1Type(type: PRType): PRL1Type {
    return PRType2L1Type[type] || PRL1Type.Undefined;
  }

  static getPartners(pr_id: PRRef): Promise<Partner[]> {
    return this.api.requestHTTP({
      method: "GET",
      endpoint: `/${pr_id}/partners`,
      schema: v.array(Partner.V),
    }).then(({ body }) => body.parsed);
  }

  static usePartners(pr_id: PRRef | undefined) {
    const _prId = ref<PRRef | undefined>(pr_id);
    const _partners = ref<Partner[]>();
    const loading = ref(false);

    const partners = computed((): Partner[] => {
      if (!_partners.value && _prId.value && !loading.value) {
        loading.value = true;
        this.getPartners(_prId.value).then((partners) => {
          _partners.value = partners;
          loading.value = false;
        });
      }
      return _partners.value || [];
    })

    function bindPRId(to_watch: any) {  // FIXME type
      watch(to_watch, (newId) => {
        _prId.value = newId;
      })
    }

    return {
      partners, loading, bindPRId
    }
  }
}
