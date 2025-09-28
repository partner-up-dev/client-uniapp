// Migartion is a special store module for migrating data from one version to another.

// store
import { defineStore } from "pinia";

// types
import { APP_VERSION } from "@/types";

// constant
import { migration_func_list } from "./funcs";

// utils
import log from "@/utils/log";


export interface MigrationState {
    history: APP_VERSION[];
}

export const useMigrationStore = defineStore('migration', {
    unistorage: true,
    state: (): MigrationState => ({
        history: []
    }),
    actions: {
        /**
         * @abstract 迁移
         * @description
         * 该方法应该在引用启动的时候被调用，检查本地的history数据执行对应的迁移操作 \
         * 
         * 如果为空，则说明是全新的安装（除了0.0.1 - 0.0.1.2，因为该功能在0.0.1.3被加入），不需要迁移 \
         * 如果有曾经迁移的历史，而且不是最新的版本，则需要执行迁移操作 \
         * 
         * 所以首先要将迁移模块出现之前的版本的数据全部清除；
         * 获取当前版本：https://blog.csdn.net/Zhuangvi/article/details/112430585
         * 
         */
        async migrate() {
            const migrations_to_run = migration_func_list.filter(migration => !this.history.includes(migration.version));

            migrations_to_run.forEach(migration => {
                try {
                    migration.up();
                    this.history.push(migration.version);
                    log.info(`Migration ${migration.version} applied.`);
                }
                catch (e) {
                    log.error(`Migration ${migration.version} failed.`, e);
                }
            })
            
        }
    }
})
