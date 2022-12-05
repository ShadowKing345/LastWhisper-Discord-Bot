import { DatabaseService } from "../../config/databaseService.js";
import { Repository } from "../repository.js";
import { EventManagerSettings } from "../../entities/eventManager/index.js";
import { repository } from "../../utils/decorators/index.js";

/**
 * Repository for EventManagerConfig
 * @see EventManagerSettings
 */
@repository()
export class EventManagerSettingsRepository extends Repository<EventManagerSettings> {
  constructor(db: DatabaseService) {
    super(db, EventManagerSettings);
  }
}
