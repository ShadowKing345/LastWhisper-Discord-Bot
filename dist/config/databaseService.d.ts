import { ProjectConfiguration } from "../utils/objects/index.js";
import { DataSource } from "typeorm";
export declare class DatabaseService {
    private readonly databaseConfigs;
    private readonly logger;
    private _dataSource;
    constructor(config: ProjectConfiguration);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get dataSource(): DataSource;
    get isConnected(): boolean;
}
//# sourceMappingURL=databaseService.d.ts.map