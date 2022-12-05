import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { EventObject } from "../../entities/eventManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";

/**
 * Repository for EventManagerConfig
 * @see EventObject
 */
@repository()
export class EventObjectRepository extends Repository<EventObject> {
  constructor(db: DatabaseService) {
    super(db, EventObject);
  }
}