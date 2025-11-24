import { type AccountRef } from "@/business/account";
import { defineStore } from "pinia";
import log from "@/utils/log";

export interface AccountState {
    account_id?: AccountRef;
    access_token?: string;
}


export const useAccountStore = defineStore('account', {
    unistorage: true,
    state(): AccountState {
        return {
            account_id: undefined,
            access_token: undefined
        }
    },

    getters: {
        isMe: (state: AccountState) => (account_id: AccountRef): boolean => {
            return state.account_id === account_id;
        },
        isLoggedIn(state: AccountState) {
            return Boolean(state.account_id);
        },
        myId(state: AccountState): string | undefined {
            return state.account_id;
        },
        authHeaders(state): {
            'Authorization'?: string
        } {
            if (!state.access_token) {
                log.error('Auth token invalid in state');
                return {};
            }

            return {
                'Authorization': `Bearer ${state.access_token}`
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
            this.access_token = authorization.slice(7);
        },

    }
})
