import { DatabaseConfiguration } from "../utils/objects/index.js";
import { DataSource } from "typeorm";
import { IOptional } from "../utils/optional/iOptional.js";
export declare class DatabaseService {
    private readonly databaseConfigs;
    private readonly logger;
    private _dataSource;
    constructor(databaseConfigs: IOptional<DatabaseConfiguration>);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get dataSource(): DataSource;
    get isConnected(): boolean;
}
//# sourceMappingURL=databaseService.d.ts.map