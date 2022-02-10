import { BuffManagerConfig } from "../models/buffManager.model.js";
export declare class BuffManagerConfigService {
    private repo;
    constructor();
    findOne(id: string): Promise<BuffManagerConfig>;
    findOneOrCreate(id: string): Promise<BuffManagerConfig>;
    update(config: BuffManagerConfig): Promise<BuffManagerConfig>;
    getAll(): Promise<BuffManagerConfig[]>;
}
