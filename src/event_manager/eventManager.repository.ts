import { injectable } from "tsyringe";

import { Database } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { deepMerge } from "../shared/utils.js";
import { EventManagerConfig } from "./models/index.js";

@injectable()
export class EventManagerRepository extends BasicRepository<EventManagerConfig> {
    private readonly collectionName: string = "event_manager";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: EventManagerConfig): EventManagerConfig {
        return deepMerge(new EventManagerConfig, config);
    }
}
