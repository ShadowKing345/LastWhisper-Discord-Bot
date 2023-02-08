import { DatabaseConfiguration } from "./entities/index.js";
import { DataSource } from "typeorm";
export declare class DatabaseService {
    private static readonly logger;
    private _dataSource;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get dataSource(): DataSource;
    get isConnected(): boolean;
    static createDataSource(config?: DatabaseConfiguration): DataSource;
}
//# sourceMappingURL=databaseService.d.ts.map