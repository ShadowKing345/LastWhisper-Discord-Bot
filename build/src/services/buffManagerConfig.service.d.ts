import { BuffManagerConfig } from "../models/buffManager.model.js";
import { BuffManagerConfigRepository } from "../repositories/buffManagerConfig.repository.js";
export declare class BuffManagerConfigService {
    private repo;
    constructor(repo: BuffManagerConfigRepository);
    findOne(id: string): Promise<BuffManagerConfig>;
    findOneOrCreate(id: string): Promise<BuffManagerConfig>;
    update(config: BuffManagerConfig): Promise<BuffManagerConfig>;
    getAll(): Promise<BuffManagerConfig[]>;
}
//# sourceMappingURL=buffManagerConfig.service.d.ts.map