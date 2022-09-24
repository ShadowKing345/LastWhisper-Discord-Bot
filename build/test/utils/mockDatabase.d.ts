import { Db } from "mongodb";
import { DatabaseConfigurationService } from "../../src/utils/config/databaseConfigurationService.js";
export declare class MockDatabase extends DatabaseConfigurationService {
    private _config;
    get db(): Db;
    get config(): any;
    set config(value: any);
}
//# sourceMappingURL=mockDatabase.d.ts.map