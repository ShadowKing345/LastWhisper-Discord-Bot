import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../utils/config/databaseConfiguration.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/utils.js";
import { EventManagerConfig } from "./models/index.js";

@singleton()
export class EventManagerRepository extends BasicRepository<EventManagerConfig> {
    private readonly collectionName: string = "event_manager";

    constructor(private db: DatabaseConfiguration) {
        super();
    }

    protected sanitiseOutput(config: EventManagerConfig): EventManagerConfig {
        return deepMerge(new EventManagerConfig, config);
    }

    protected get collection(): Collection<EventManagerConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
