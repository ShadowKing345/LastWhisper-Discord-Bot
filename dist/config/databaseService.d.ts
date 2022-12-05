import { pino } from "pino";
import { ProjectConfiguration } from "../utils/objects/index.js";
import { ConfigurationService } from "./configurationService.js";
import { DataSource } from "typeorm";
export declare class DatabaseService extends ConfigurationService {
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