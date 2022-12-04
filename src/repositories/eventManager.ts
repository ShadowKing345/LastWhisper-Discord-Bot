import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { EventManagerConfig } from "../entities/eventManager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for EventManagerConfig
 * @see EventManagerConfig
 */
@repository()
export class EventManagerRepository extends Repository<EventManagerConfig> {
  constructor(db: DatabaseService) {
    super(db, EventManagerConfig);
  }
}
