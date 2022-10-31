import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { EventManagerConfig } from "../models/event_manager/index.js";
export declare class EventManagerRepository extends RepositoryBase<EventManagerConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof EventManagerConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=eventManager.repository.d.ts.map