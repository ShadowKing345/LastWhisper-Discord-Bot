import { pino } from "pino";
import { DatabaseConfiguration } from "../utils/objects/index.js";
import { DataSource } from "typeorm";
export declare class DatabaseService {
    private logger;
    private readonly databaseConfigs;
    private _dataSource;
    constructor(databaseConfigs: DatabaseConfiguration, logger: pino.Logger);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get dataSource(): DataSource;
    get isConnected(): boolean;
}
//# sourceMappingURL=databaseService.d.ts.map