import { pino } from "pino";
import { ProjectConfiguration } from "../utils/objects/index.js";
import { ConfigurationClass } from "./configurationClass.js";
import { DataSource } from "typeorm";
export declare class DatabaseService extends ConfigurationClass {
    private projectConfig;
    private logger;
    private _dataSource;
    constructor(projectConfig: ProjectConfiguration, logger: pino.Logger);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get dataSource(): DataSource;
    get isConnected(): boolean;
}
//# sourceMappingURL=databaseService.d.ts.map