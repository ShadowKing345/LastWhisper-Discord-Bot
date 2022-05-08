import { EventManagerConfig } from "../models/eventManager.model.js";
import { EventManagerRepository } from "../repositories/eventManager.repository.js";
export declare class EventManagerConfigService {
    private repo;
    constructor(repo: EventManagerRepository);
    findOne(id: string): Promise<EventManagerConfig>;
    findOneOrCreate(id: string): Promise<EventManagerConfig>;
    update(config: EventManagerConfig): Promise<EventManagerConfig>;
    getAll(): Promise<EventManagerConfig[]>;
    bulkUpdate(configs: EventManagerConfig[]): Promise<void>;
}
//# sourceMappingURL=eventManagerConfig.service.d.ts.map