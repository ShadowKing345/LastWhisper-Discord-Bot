import { Collection } from "mongodb";
import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { BuffManagerConfig } from "./models/index.js";
export declare class BuffManagerRepository extends BasicRepository<BuffManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfiguration);
    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig;
    protected get collection(): Collection<BuffManagerConfig>;
}
//# sourceMappingURL=buffManager.repository.d.ts.map