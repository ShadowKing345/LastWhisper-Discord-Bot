import { DatabaseConfiguration } from "./entities/index.js";
import { DataSource } from "typeorm";
export declare class DatabaseService {
    private readonly logger;
    private _dataSource;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get dataSource(): DataSource;
    get isConnected(): boolean;
    static createDataSource(config?: DatabaseConfiguration): DataSource;
}
export declare const AppDataSource: DataSource;
//# sourceMappingURL=databaseService.d.ts.map