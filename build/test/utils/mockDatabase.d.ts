import { Db } from "mongodb";
import { DatabaseConfiguration } from "../../src/config/databaseConfiguration.js";
export declare class MockDatabase extends DatabaseConfiguration {
    private _config;
    get db(): Db;
    get config(): any;
    set config(value: any);
}
//# sourceMappingURL=mockDatabase.d.ts.map