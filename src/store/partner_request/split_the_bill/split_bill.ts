// partner_request/split_the_bill/split_bill
// #146

// store
import { defineStore } from "pinia";

// api
import { V1SplitBillGet } from "@/api/main/split_the_bill";

// types
import type { SplitBill, SplitBillRef } from "@/types/partner_request/split_the_bill";
import type { AccountProfile } from "@/types/account";
import { useAccountStore } from "@/store/account";

export interface SplitBillState {
    split_bills: {
        [key: SplitBillRef]: SplitBill
    }
}

export const useSplitBillStore = defineStore('partner_request/split_the_bill/split_bill', {
    unistorage: true,
    state: (): SplitBillState => {
        return {
            split_bills: {}
        }
    },
    getters: {
        splitBill: (state) => {
            return (split_bill_id: SplitBillRef, refresh: boolean = false): SplitBill | null => {
                const result = state.split_bills[split_bill_id]; 
                if (!result && refresh) {
                    // BACKEND V1SplitBillGet
                    V1SplitBillGet(split_bill_id)
                }

                return result || null;
            }
        }
    },
    actions: {
        upsertSplitBill(split_bill: SplitBill) {
            this.split_bills[split_bill._id] = split_bill;
            return split_bill._id;
        }
    }
})