import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/repository/repositoryBase.js";
import { EventManagerConfig } from "./models/index.js";
export declare class EventManagerRepository extends RepositoryBase<EventManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfigurationService);
    protected sanitiseOutput(config: EventManagerConfig): EventManagerConfig;
    protected get collection(): Collection<EventManagerConfig>;
}
//# sourceMappingURL=eventManager.repository.d.ts.map