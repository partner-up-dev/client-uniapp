// Contract Module's Store

// types
import type { Contract } from "../../types/contract";

// store
import { defineStore } from "pinia";

// api
import { V1ContractGet } from "../../api/main/contract";


export interface LegalDocument {
    /**
     * 契约对应的LegalDocument在本地的位置
     */
    path: string, 
    /**
     * 上次更新时间 \
     * 因为unistorage插件没有实现expire
     */
    updated_at: number
}

export interface ContractState {
    contracts: {
        [key: number]: Contract
    },
    // legal_documents: {
    //     [key: number]: LegalDocument
    // }
}

export const useContractStore = defineStore('contract', {
    unistorage: true,
    state: (): ContractState => {
        return {
            contracts: {},
            // legal_documents: {}
        }
    },

    getters: {
        /**
         * 
         * @param refresh  
         * 是否刷新缓存，是则从后端获取，会在下次调用时体现 \
         * 仅在miss时使用
         */
        contract(state: ContractState) {
            return (contract_id: number, refresh: boolean = false): Contract | null => {
                const data = state.contracts[contract_id] || null;

                if (refresh && !data) {
                    V1ContractGet(contract_id);
                }

                return data;
            }
        },
        /**
         * @description
         * 必须取得contract，如果本地没有缓存就从后端获取
         */
        contract_Force(state: ContractState) {
            return async (contract_id: number): Promise<Contract> => {
                const data = state.contracts[contract_id];
                if (data) {
                    return data;
                }
                else {
                    const res = await V1ContractGet(contract_id);
                    return res.data;
                }
            }
        },
        // legal_document(state) {
        //     return (contract_id: number): LegalDocument | null => {
        //         return state.legal_documents[contract_id] || null;
        //     }
        // }
    },

    actions: {
        async upsertContract(raw: Contract) {
            this.contracts[raw._id] = raw;
        }
    }
})

