import { Database } from "../config/databaseConfiguration.js";
import { EventManagerConfig } from "../models/eventManager.model.js";
import { BasicRepository } from "./basicRepository.js";
export declare class EventManagerRepository extends BasicRepository<EventManagerConfig> {
    protected db: Database;
    private readonly collectionName;
    constructor(db: Database);
    protected sanitiseOutput(config: EventManagerConfig): EventManagerConfig;
}
//# sourceMappingURL=eventManager.repository.d.ts.map