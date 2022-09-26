import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { ManagerUtilsConfig } from "../models/manager_utils/managerUtils.model.js";
export declare class ManagerUtilsRepository extends RepositoryBase<ManagerUtilsConfig> {
    private readonly collectionName;
    protected readonly sanitizedObject: typeof ManagerUtilsConfig;
    protected readonly collection: Collection<ManagerUtilsConfig>;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=managerUtils.repository.d.ts.map