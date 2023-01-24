import { DatabaseService } from "../../config/index.js";
import { EventManagerSettings } from "../../entities/eventManager/index.js";
import { repository } from "../../utils/decorators/index.js";
import { SelfCreatingRepository } from "../base/selfCreatingRepository.js";

/**
 * Repository for EventManagerConfig
 * @see EventManagerSettings
 */
@repository()
export class EventManagerSettingsRepository extends SelfCreatingRepository<EventManagerSettings> {
  constructor(db: DatabaseService) {
    super(db, EventManagerSettings);
  }
}
