import { Collection } from "mongodb";
import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { EventManagerConfig } from "../models/event_manager/index.js";
export declare class EventManagerRepository extends RepositoryBase<EventManagerConfig> {
    private readonly collectionName;
    protected readonly sanitizedObject: typeof EventManagerConfig;
    protected readonly collection: Collection<EventManagerConfig>;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=eventManager.repository.d.ts.map