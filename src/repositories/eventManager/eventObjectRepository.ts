import { DatabaseService } from "../../config/index.js";
import { EventObject } from "../../entities/eventManager/index.js";
import { repository } from "../../decorators/index.js";
import { Repository } from "../base/repository.js";

/**
 * Repository for EventManagerConfig
 * @see EventObject
 */
@repository()
export class EventObjectRepository extends Repository<EventObject> {
  constructor(db: DatabaseService) {
    super(db, EventObject);
  }

  public async getEventsByGuildId(guildId: string): Promise<EventObject[]> {
    return this.repo.find({ where: { guildId } });
  }
}