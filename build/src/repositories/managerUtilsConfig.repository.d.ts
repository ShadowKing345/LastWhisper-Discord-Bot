import { Database } from "../config/databaseConfiguration.js";
import { ManagerUtilsConfig } from "../models/mangerUtils.model.js";
import { BasicRepository } from "./basicRepository.js";
export declare class ManagerUtilsConfigRepository extends BasicRepository<ManagerUtilsConfig> {
    protected db: Database;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig;
}
//# sourceMappingURL=managerUtilsConfig.repository.d.ts.map