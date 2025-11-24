// Setting Module's Store Module

// store
import { defineStore } from "pinia";


export interface SettingState {
    locale: 'zh-Hans' | 'en' | 'zh-Hant' | string;

}


export const useSettingStore = defineStore('setting', {
    unistorage: true,
    state: (): SettingState => {
        return {
            locale: uni.getLocale()
        }
    },

    getters: {
        locale: (state: SettingState) => state.locale
    },

    actions: {
        setLocale(locale: SettingState['locale'] | undefined) {
            this.locale = locale || 'zh-Hans';
        }
    }

});
