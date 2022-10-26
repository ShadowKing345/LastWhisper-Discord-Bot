import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";
export declare class BuffManagerRepository extends RepositoryBase<BuffManagerConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof BuffManagerConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=buffManager.repository.d.ts.map