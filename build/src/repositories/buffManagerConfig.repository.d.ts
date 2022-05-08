import { Database } from "../config/databaseConfiguration.js";
import { BuffManagerConfig } from "../models/buffManager.model.js";
import { BasicRepository } from "./basicRepository.js";
export declare class BuffManagerConfigRepository extends BasicRepository<BuffManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig;
}
//# sourceMappingURL=buffManagerConfig.repository.d.ts.map