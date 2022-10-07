import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { ManagerUtilsConfig } from "../models/manager_utils/managerUtils.model.js";
export declare class ManagerUtilsRepository extends RepositoryBase<ManagerUtilsConfig> {
    protected readonly collectionName: string;
    protected readonly sanitizedObject: typeof ManagerUtilsConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=managerUtils.repository.d.ts.map