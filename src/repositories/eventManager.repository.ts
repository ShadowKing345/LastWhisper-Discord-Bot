import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { EventManagerConfig } from "../models/event_manager/index.js";

@singleton()
export class EventManagerRepository extends RepositoryBase<EventManagerConfig> {
    private readonly collectionName: string = "event_manager";

    protected readonly sanitizedObject = EventManagerConfig;
    protected readonly collection: Collection<EventManagerConfig>;

    constructor(db: DatabaseConfigurationService) {
        super();
        this.collection = db.db?.collection(this.collectionName);
    }
}
