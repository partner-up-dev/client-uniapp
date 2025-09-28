// Account API's store

import { defineStore } from "pinia";
import log from "@/utils/log";


export interface APIMainStore {
    token?: string;
}

export const useAccountAPIStore = defineStore('api/account', {
    unistorage: true,

    state: (): APIMainStore => {
        return {
            token: undefined
        }
    },

    getters: {
        authHeaders(state): {
            'Authorization'?: string
        } {
            if (!state.token) {
                log.error('Auth token invalid in state');
                return {};
            }

            return {
                'Authorization': `Bearer ${state.token}`
            }
        }
    },

    actions: {
        upsertToken(headers: {
            'Authorization'?: string,
            'authorization'?: string
        }) {

            const authorization = headers.Authorization || headers.authorization;
            if (!authorization) {
                log.warn('no authorization info in response headers');
                return;
            }
            this.token = authorization.slice(7);
        }
    }

});

