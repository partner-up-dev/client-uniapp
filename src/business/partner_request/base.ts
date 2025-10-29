import { Partner } from "./partner";
import { APIClient } from "../api";
import { useTranslate } from "@/locale/use";
import { computed, ref, watch } from "vue";
import { instance, V, nullable, limit_string } from "../index";
import { type PRRef, PRRefV, PRType, PRStatus, PRL1Type, PRType2L1Type } from ".";
import * as v from 'valibot';
import { DatetimeV } from "../base";

// Export PartnerRequestForm from form.ts
export { PartnerRequestForm } from "./form";


export class PartnerRequest extends V.class(v.object({
  _id: PRRefV,
  created_at: DatetimeV,
  created_by: v.string(),
  type: v.enum(PRType),
  status: v.enum(PRStatus),
  title: nullable(limit_string(3, 12)),
  introduction: nullable(limit_string(3, 60)),
  chat: nullable(v.number()),
  contract: v.number(),
})) {

  static INTRODUCTION_MAXLENGTH = 60;
  static TITLE_MAXLENGTH = 12;

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
      schema: v.array(instance(Partner)),
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

  static get(pr_id: PRRef): Promise<PartnerRequest> {
    return this.api.requestHTTP({
      method: 'GET',
      endpoint: `/${pr_id}`,
      operation_id: 'PartnerRequestV2Get',
    }).then(res => res.body.parsed);
  }

  static use(prId?: PRRef, partnerRequest?: PartnerRequest) {
    const _pr = ref<PartnerRequest | undefined>(partnerRequest);
    const _prId = ref<PRRef | undefined>(prId);
    const loading = ref(false);

    const pr = computed((): PartnerRequest | undefined => {
      if (!_pr.value && _prId.value && !loading.value) {
        loading.value = true;
        this.get(_prId.value).then((pr) => {
          _pr.value = pr;
          loading.value = false;
        });
      }
      return _pr.value;
    })

    const bindPR = (to_watch: any) => {
      watch(to_watch, (newPr) => {
        _pr.value = newPr;
      })
    }
    const bindPRId = (to_watch: any) => {
      watch(to_watch, (newId) => {
        _prId.value = newId;
      })
    }

    return {
      pr, loading, bindPR, bindPRId
    }
  }

  get typeText() {
    return PartnerRequest.api.dt(`type.${this.type}`)
  }

  static useDraftPRs() {
    const _draftPRs = ref<PRRef[]>([]);
    const loading = ref(false);

    const draftPRs = computed((): PRRef[] => {
      if (_draftPRs.value.length === 0 && !loading.value) {
        refresh();
      }
      return _draftPRs.value;
    })

    const refresh = () => {
      loading.value = true;
      return this.api.requestHTTP({
        method: 'GET',
        endpoint: '/list/draft',
        schema: v.array(PRRefV),
      }).then(({ body }) => {
        _draftPRs.value = body.parsed;
        loading.value = false;
      })
    }

    return {
      draftPRs, loading, refresh
    }
  }

  static publish(pr_id: PRRef): Promise<void> {
    return this.api.requestHTTP({
      method: 'PUT',
      endpoint: `/${pr_id}/publish`,
      operation_id: 'PartnerRequestV2Publish',
    }).then(() => undefined);
  }
}
