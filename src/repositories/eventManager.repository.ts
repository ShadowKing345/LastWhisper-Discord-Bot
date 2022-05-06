import {injectable} from "tsyringe";

import {Database} from "../config/databaseConfiguration.js";
import {EventManagerConfig} from "../models/eventManager.model.js";
import {deepMerge} from "../utils/utils.js";
import {BasicRepository} from "./basicRepository.js";

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
