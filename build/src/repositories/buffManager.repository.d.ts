import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";
export declare class BuffManagerRepository extends RepositoryBase<BuffManagerConfig> {
    private db;
    private readonly collectionName;
    protected readonly sanitizedObject: typeof BuffManagerConfig;
    protected get collection(): Collection<BuffManagerConfig>;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=buffManager.repository.d.ts.map