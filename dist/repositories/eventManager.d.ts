import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { EventManagerConfig } from "../entities/event_manager/index.js";
export declare class EventManagerRepository extends Repository<EventManagerConfig> {
    db: DatabaseConfigurationService;
    constructor(db: DatabaseConfigurationService);
}
//# sourceMappingURL=eventManager.d.ts.map