import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { EventManagerConfig } from "../models/event_manager/index.js";

/**
 * Repository for EventManagerConfig
 * @see EventManagerConfig
 */
@singleton()
export class EventManagerRepository extends RepositoryBase<EventManagerConfig> {
  protected readonly collectionName: string = "event_manager";
  protected readonly mappingObject = EventManagerConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
