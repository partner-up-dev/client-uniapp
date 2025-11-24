// base/requirement Store Module

import { defineStore } from "pinia";
import { type LocationRef, Location } from "@/business/base/route";


export interface BaseLocationState {
    locations: {
        [key: LocationRef]: Location
    }
}


export const useBaseLocationStore = defineStore('base/location', {
    unistorage: true,
    state: (): BaseLocationState => {
        return {
            locations: {}
        }
    },
    getters: {
        fetchById(state: BaseLocationState) {
            return (location_id: LocationRef): Location | undefined => {
                const data = state.locations[location_id];
                if (!data) return undefined;
                return Location.parse(data);
            };
        }
    },
    actions: {
        upsert(location: Location) {
            if (!location._id) return;
            this.locations[location._id] = location;
        }
    }
})

/**
     * @name 将Location转换为坐标字符串
     * @param location 
     * @param separator 经纬度分隔符，默认为","
     * @returns 
     */
export function locationToCoordStr(location: Location, separator: string = ","): string {
    return `${location.lat}${separator}${location.lng}`;
};
