import { DatabaseService } from "../../config/index.js";
import { EventReminder } from "../../entities/eventManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";

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
