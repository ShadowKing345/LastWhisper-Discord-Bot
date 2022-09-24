import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/repository/repositoryBase.js";
import { BuffManagerConfig } from "./models/index.js";
export declare class BuffManagerRepository extends RepositoryBase<BuffManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfigurationService);
    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig;
    protected get collection(): Collection<BuffManagerConfig>;
}
//# sourceMappingURL=buffManager.repository.d.ts.map