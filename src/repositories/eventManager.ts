import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { EventManagerConfig } from "../entities/event_manager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for EventManagerConfig
 * @see EventManagerConfig
 */
@repository()
export class EventManagerRepository extends Repository<EventManagerConfig> {
  protected readonly collectionName: string = "event_manager";
  protected readonly mappingObject = EventManagerConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
