import { Db } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../../src/config/databaseConfiguration.js";
import { deepMerge } from "../../src/shared/utils.js";

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