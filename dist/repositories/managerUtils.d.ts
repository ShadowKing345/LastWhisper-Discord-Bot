import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
export declare class ManagerUtilsRepository extends Repository<ManagerUtilsConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof ManagerUtilsConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=managerUtils.d.ts.map