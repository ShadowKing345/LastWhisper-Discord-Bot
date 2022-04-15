import { injectable } from "tsyringe";

import { Database } from "../config/databaseConfiguration.js";
import { BuffManagerConfig } from "../models/buffManager.model.js";
import { EventManagerConfig, EventObj } from "../models/eventManager.model.js";
import { BasicRepository } from "./basicRepository.js";

@injectable()
export class EventManagerRepository extends BasicRepository<EventManagerConfig> {
    private readonly collectionName: string = "event_manager";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: EventManagerConfig): EventManagerConfig {
        config = Object.assign(new BuffManagerConfig(), config);
        config.events = config.events.map(event => Object.assign(EventObj, event));

        return config;
    }
}
