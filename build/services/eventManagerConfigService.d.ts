import { EventManagerConfig } from "../models/eventManager.js";
export declare class EventManagerConfigService {
    private repo;
    constructor();
    findOne(id: string): Promise<EventManagerConfig>;
    findOneOrCreate(id: string): Promise<EventManagerConfig>;
    update(config: EventManagerConfig): Promise<EventManagerConfig>;
    getAll(): Promise<EventManagerConfig[]>;
    bulkUpdate(configs: EventManagerConfig[]): Promise<void>;
}
