import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/index.js";
import { EventManagerConfig } from "./models/index.js";

@singleton()
export class EventManagerRepository extends BasicRepository<EventManagerConfig> {
    private readonly collectionName: string = "event_manager";

    constructor(private db: DatabaseConfigurationService) {
        super();
    }

    protected sanitiseOutput(config: EventManagerConfig): EventManagerConfig {
        return deepMerge(new EventManagerConfig, config);
    }

    protected get collection(): Collection<EventManagerConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
