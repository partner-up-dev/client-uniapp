// Migration Functions

// types
import { APP_VERSION } from "@/types";

export interface MigrationFunc {
    version: APP_VERSION;
    up: () => void;
}

export const migration_func_list = [
    {
        version: APP_VERSION.V0_1_3,
        up: () => {
            uni.clearStorageSync();
        }
    },
    {
        version: APP_VERSION.V0_2_0,
        up: () => {
            uni.clearStorageSync();
        }
    }
] as MigrationFunc[] 
