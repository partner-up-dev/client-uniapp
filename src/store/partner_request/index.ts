// desc: PartnerRequest Module's Store

// types
import { PRType } from "@/business/partner_request";
import type { PartnerRequestForm } from "@/business/partner_request/base";

// store
import { defineStore } from "pinia";
import { deepcopy } from "@/utils";


export interface PartnerRequestState {
    draft?: {
        type: PRType;
        content: PartnerRequestForm;
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
        draftContent(state: PartnerRequestState): PartnerRequestForm | null {
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
        draftType(state: PartnerRequestState): PRType | null {
            if (state.draft) {
                return state.draft.type;
            }
            return null;
        }
    },

    actions: {
        async saveDraft(type: PRType, content: PartnerRequestForm) {
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
