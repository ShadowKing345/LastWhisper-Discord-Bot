import { Collection } from "mongodb";
import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { EventManagerConfig } from "./models/index.js";
export declare class EventManagerRepository extends BasicRepository<EventManagerConfig> {
    private db;
    private readonly collectionName;
    constructor(db: DatabaseConfiguration);
    protected sanitiseOutput(config: EventManagerConfig): EventManagerConfig;
    protected get collection(): Collection<EventManagerConfig>;
}
//# sourceMappingURL=eventManager.repository.d.ts.map