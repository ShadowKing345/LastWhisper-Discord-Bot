import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { ManagerUtilsConfig } from "../models/managerUtils.js";
export declare class ManagerUtilsRepository extends RepositoryBase<ManagerUtilsConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof ManagerUtilsConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=managerUtils.d.ts.map