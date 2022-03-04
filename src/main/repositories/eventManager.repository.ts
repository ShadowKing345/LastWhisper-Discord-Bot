import {Collection, Filter} from "mongodb";
import {EventManagerConfig, EventObj} from "../models/eventManager.model.js";
import {Database, DB} from "../config/databaseConfiguration.js";
import {injectable} from "tsyringe";
import {BasicRepository} from "./basicRepository";
import {BuffManagerConfig} from "../models/buffManager.model";

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
