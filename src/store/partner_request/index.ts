// desc: PartnerRequest Module's Store

// types
import { PartnerRequestType } from "@/types/partner_request";
import type { PartnerRequestEditableContentUnion } from "@/data/form";

// store
import { defineStore } from "pinia";
import { deepcopy } from "@/utils";


export interface PartnerRequestState {
    draft?: {
        type: PartnerRequestType;
        content: PartnerRequestEditableContentUnion;
    };
}

export const usePartnerRequestStore = defineStore('partner_request', {
    unistorage: true,
    state: (): PartnerRequestState => {
        return {
            draft: undefined,
        }
    },

    getters: {
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
import { PartnerRequestStatus } from "@/types/partner_request";
import { PartnerRequest } from "@/business/partner_request/base";
import type { PRRef } from "@/business/partner_request";

/**
 * @name 搭子请求Vue Composable
 */
export function usePartnerRequest(id?: PRRef) {
    const partner_request_id = ref(id);

    const { pr, loading: prLoading } = PartnerRequest.usePR(id);
    
    /**
     * @name 是否正在寻找搭子
     */
    const isWaitingForPartners = computed((): boolean => {
        return pr.value?.status === PartnerRequestStatus.WaitingForPartners;
    });

    return {
        partner_request_id,
        loading: prLoading,
        partnerRequest: pr,
        isWaitingForPartners
    }
}
