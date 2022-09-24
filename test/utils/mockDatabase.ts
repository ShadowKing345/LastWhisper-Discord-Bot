import { Db } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../../src/utils/config/databaseConfiguration.js";
import { deepMerge } from "../../src/utils/utils.js";

@singleton()
export class MockDatabase extends DatabaseConfiguration {
    private _config: any = null;

    public get db() {
        return {
            collection: () => {
                return {
                    findOneAndReplace: async (_, obj) => {
                        Object.assign(this._config, obj);
                        return this._config;
                    },
                    findOne: async () => this._config,
                    find: () => ({
                        toArray: async () => [ this._config ],
                    }),
                    replaceOne: async (obj) => {
                        deepMerge(this._config, obj);
                        return this._config;
                    },
                    initializeOrderedBulkOp: () => ({
                        find: () => ({
                            upsert: () => ({
                                replaceOne: (obj) => {
                                    Object.assign(this._config, obj);
                                    return this._config;
                                }
                            }),
                        }),
                        execute: () => null,
                    }),
                };
            },
        } as unknown as Db;
    }

    public get config() {
        return this._config;
    }

    public set config(value: any) {
        this._config = value;
    }
}