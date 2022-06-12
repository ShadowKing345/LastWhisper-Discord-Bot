import { Database } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { ManagerUtilsConfig } from "./managerUtils.model.js";
export declare class ManagerUtilsRepository extends BasicRepository<ManagerUtilsConfig> {
    protected db: Database;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig;
}
//# sourceMappingURL=managerUtils.repository.d.ts.map