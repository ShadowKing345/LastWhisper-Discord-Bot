import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../base/repository.js";
import { EventReminder } from "../../entities/eventManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";

/**
 * Repository for EventManagerConfig
 * @see EventReminder
 */
@repository()
export class EventReminderRepository extends Repository<EventReminder> {
  constructor(db: DatabaseService) {
    super(db, EventReminder);
  }
}
