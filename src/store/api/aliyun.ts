// API/Aliyun's Store Module

// store
import { defineStore } from "pinia";

// types
import type { STSCredential } from "@/types/aliyun/sts";


export  interface APIAliyunState {
    aliyun_sts: STSCredential | null; 
}


export const useAPIAliyunStore = defineStore('api/aliyun', {
    unistorage: true,

    state(): APIAliyunState {
        return {
            aliyun_sts: null
        }
    },

    getters: {
        AliyunSTS: (state: APIAliyunState) => state.aliyun_sts
    },

    actions: {
        setAliyunSTS(aliyun_sts: STSCredential) {
            this.aliyun_sts = aliyun_sts;
        }
    },

})
