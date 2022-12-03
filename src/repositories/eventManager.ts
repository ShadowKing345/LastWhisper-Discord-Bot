import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { EventManagerConfig } from "../entities/event_manager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for EventManagerConfig
 * @see EventManagerConfig
 */
@repository()
export class EventManagerRepository extends Repository<EventManagerConfig> {
  constructor(db: DatabaseConfigurationService) {
    super(db, EventManagerConfig);
  }
}
