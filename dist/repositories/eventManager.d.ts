import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { EventManagerConfig } from "../models/event_manager/index.js";
export declare class EventManagerRepository extends Repository<EventManagerConfig> {
    protected readonly collectionName: string;
    protected readonly mappingObject: typeof EventManagerConfig;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=eventManager.d.ts.map