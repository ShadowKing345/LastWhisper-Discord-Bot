var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { singleton } from "tsyringe";
import { DatabaseConfigurationService } from "../../src/utils/config/databaseConfigurationService.js";
import { deepMerge } from "../../src/utils/index.js";
let MockDatabase = class MockDatabase extends DatabaseConfigurationService {
    _config = null;
    get db() {
        return {
            collection: () => {
                return {
                    findOneAndReplace: async (_, obj) => {
                        Object.assign(this._config, obj);
                        return this._config;
                    },
                    findOne: async () => this._config,
                    find: () => ({
                        toArray: async () => [this._config],
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
        };
    }
    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
    }
};
MockDatabase = __decorate([
    singleton()
], MockDatabase);
export { MockDatabase };
//# sourceMappingURL=mockDatabase.js.map