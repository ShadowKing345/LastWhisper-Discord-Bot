import { Database } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { BuffManagerConfig } from "./models/index.js";
export declare class BuffManagerRepository extends BasicRepository<BuffManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: BuffManagerConfig): BuffManagerConfig;
}
//# sourceMappingURL=buffManager.repository.d.ts.map