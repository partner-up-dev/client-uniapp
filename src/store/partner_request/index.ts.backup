// desc: PartnerRequest Module's Store

// types
import { PartnerRequestStatus, PartnerRequestType } from "@/types/partner_request";
import type { PartnerRequestEditableContentUnion } from "@/data/form";
import type { PartnerRequestDetailUnion, PartnerRequestUnion } from "@/types/partner_request/union";
import type { PartnerRequestFeedDisplay } from "@/types/partner_request/display";
import type { RideHailingPartnerRequest } from "@/types/partner_request/ride_hailing";
import type { CommutePartnerRequest } from "@/types/partner_request/commute";
import type { TravelPartnerRequest } from "@/types/partner_request/travel";
import type { PartnerApplication } from "@/types/partner_request/partner_application";

// constant
import { DEFAULT_PARTNER_REQUEST } from "@/data/default_data";

// store
import { defineStore } from "pinia";
import { useAccountStore } from "../account";
import { deepcopy } from "@/utils";

// api
import { V1PartnerRequestGet } from "@/api/main/partner_request";


export interface PartnerRequestState {
    partner_requests: {
        [key: number]: PartnerRequestUnion<PartnerRequestType>
    };
    draft?: {
        type: PartnerRequestType;
        content: PartnerRequestEditableContentUnion;
    };
}

export const usePartnerRequestStore = defineStore('partner_request', {
    unistorage: true,
    state: (): PartnerRequestState => {
        return {
            partner_requests: {},
            draft: undefined,
        }
    },

    getters: {
        partnerRequestDisplay(state: PartnerRequestState) {
            return (partner_request_id: number): PartnerRequestFeedDisplay<PartnerRequestType> | null => {
                const raw = this.getPRById(partner_request_id);
                if (!raw) return raw;

                const specific_content = 
                ((): PartnerRequestFeedDisplay<PartnerRequestType>["content"]["specific_content"] => {
                    const pri_type = raw.type[0];
                    if (pri_type === PartnerRequestType.RideHailing) {
                        const raw2 = raw as RideHailingPartnerRequest;
                        return {
                            route: raw2.route,
                            ride_hailing_preference: raw2.ride_hailing_preference,
                            ride_hailing_order: raw2.ride_hailing_order
                        }
                    }
                    else if (pri_type === PartnerRequestType.Commute) {
                        const raw2 = raw as CommutePartnerRequest;
                        return {
                            route: raw2.route,
                            on_at: raw2.on_at,
                            off_at: raw2.off_at,
                            workdays: raw2.workdays,
                            split_the_bill: raw2.split_the_bill,
                            ride_hailing_orders: raw2.ride_hailing_orders
                        }
                    }
                    else if (pri_type === PartnerRequestType.Travel) {
                        const raw2 = raw as TravelPartnerRequest;
                        return {
                        }
                    }
                    return {}
                })

                return {
                    metadata: {
                        _id: raw._id,
                        created_at: raw.created_at,
                        type: raw.type,
                        status: raw.status,
                        partners: raw.partners,
                        title: raw.title,
                    },
                    content: {
                        strict_requirements: raw.strict_requirements,
                        soft_requirements: raw.soft_requirements,
                        introduction: raw.introduction,
                        specific_content: specific_content()
                    }
                }
            }
        },
        getPRById: (state: PartnerRequestState) => 
            (partner_request_id: number, api_on_miss: boolean = true): PartnerRequestUnion<PartnerRequestType> | undefined => {
                const data = state.partner_requests[partner_request_id];

                if (api_on_miss && !data) {
                    V1PartnerRequestGet(partner_request_id);
                }
                return data;

        },
        partnerRequestType: (state: PartnerRequestState) => (partner_request_id: number): PartnerRequestType[] | null => {
            const raw = state.partner_requests[partner_request_id];
            if (!raw) return null;
            return raw.type;
        },
        isFavorited(state: PartnerRequestState) {
            return (partner_request_id: number): boolean => {
                return useAccountStore().myFavoritedPRs.includes(partner_request_id);
            }
        },
        /**
         * @name 本地存稿
         * @description
         * 搭子请求编辑器的自动存稿
         * 
         */
        draftContent(state: PartnerRequestState): PartnerRequestEditableContentUnion | null {
            if (state.draft) {
                try {
                    return deepcopy(state.draft.content);
                }
                catch (e) {
                    // draft broken
                    state.draft = undefined;
                    return null;
                }
            }
            return null;
        },
        /**
         * @name 本地存稿的搭子请求类型
         */
        draftType(state: PartnerRequestState): PartnerRequestType | null {
            if (state.draft) {
                return state.draft.type;
            }
            return null;
        }
    },

    actions: {
        async upsertPartnerRequest(raw: PartnerRequestUnion<PartnerRequestType>) {
            this.partner_requests[raw._id] = raw;
        },
        async upsertPartnerRequestFromFeed(feed: PartnerRequestFeedDisplay<PartnerRequestType>) {

            const raw = this.partner_requests[feed.metadata._id] || deepcopy(DEFAULT_PARTNER_REQUEST);
    
            raw._id = feed.metadata._id;
            raw.created_at = feed.metadata.created_at;
            raw.type = feed.metadata.type;
            raw.status = feed.metadata.status;
            raw.partners = feed.metadata.partners;
            raw.title = feed.metadata.title;
            raw.introduction = feed.content.introduction;
            raw.strict_requirements = feed.content.strict_requirements;
            raw.soft_requirements = feed.content.soft_requirements;
    
            Object.assign(raw, {
                ...feed.content.specific_content
            });
    
            this.upsertPartnerRequest(raw);
        },
        async upsertPartnerRequestFromDetail(detail: PartnerRequestDetailUnion<PartnerRequestType>) {
            throw new Error("Not Implemented");
        },
        async addApplication(partner_request_id: number, application: PartnerApplication) {
            const raw = this.getPRById(partner_request_id);
            if (!raw) return;
            raw.applications.push(application);
            this.upsertPartnerRequest(raw);
        },
        async setStatus(partner_request_id: number, status: PartnerRequestStatus) {
            const raw = this.getPRById(partner_request_id);
            if (!raw) return;
            raw.status = status;
        },
        async updatePartnerRequest(partner_request_id: number, to_update: Partial<PartnerRequestUnion>) {
            const raw = this.getPRById(partner_request_id);
            if (raw) {
                const new_ = Object.assign(raw, to_update);
                this.upsertPartnerRequest(new_);
            }
        },
        async saveDraft(type: PartnerRequestType, content: PartnerRequestEditableContentUnion) {
            this.draft = {
                type,
                content
            }
        },
        async clearDraft() {
            this.draft = undefined
        }
    },

});

import { ref, computed } from "vue";

/**
 * @name 搭子请求Vue Composable
 */
export function usePartnerRequest(id: number = 0) {
    const partner_request_id = ref(id);
    const loading = ref({
        partner_request: true,
    });

    /**
     * @name 搭子请求数据
     */
    const partnerRequest = computed((): PartnerRequestUnion<PartnerRequestType> => {
        if (!partner_request_id.value) return DEFAULT_PARTNER_REQUEST;
        const data = usePartnerRequestStore().getPRById(partner_request_id.value, true);
        loading.value.partner_request = !data;
        return data || DEFAULT_PARTNER_REQUEST;
    });
    /**
     * @name 是否正在寻找搭子
     */
    const isWaitingForPartners = computed((): boolean => {
        return partnerRequest.value.status === PartnerRequestStatus.WaitingForPartners;
    });

    return {
        partner_request_id,
        loading,
        partnerRequest,
        isWaitingForPartners
    }
}