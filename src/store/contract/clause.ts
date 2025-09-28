// Contract/Clause Module's Store

// types
import type { Clause } from "../../types/contract/clause";

// api
import { V1ContractGetClause } from "@/api/main/contract/clause";

// store
import { defineStore } from "pinia";


export interface ClauseStatus {
    clauses: {
        [key: number]: Clause
    }
}

export const useContractClauseStore = defineStore('contract/clause', {
    unistorage: true,
    state: (): ClauseStatus => {
        return {
            clauses: {}
        }
    },

    getters: {
        clause(state: ClauseStatus) {
            return (clause_id: number, refresh: boolean = false): Clause | null => {
                const data = state.clauses[clause_id] || null;
                if (refresh && !data) {
                    V1ContractGetClause(clause_id);
                }
                return data;
            }
        },
    },

    actions: {
        async upsertClause(raw: Clause) {
            this.clauses[raw._id] = raw;
        }
    }
})
