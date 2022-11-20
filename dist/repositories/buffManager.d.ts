import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";
export declare class BuffManagerRepository extends Repository<BuffManagerConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof BuffManagerConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=buffManager.d.ts.map