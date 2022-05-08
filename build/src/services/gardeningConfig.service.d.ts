import { GardeningConfig } from "../models/gardeningConfig.model.js";
import { GardeningConfigRepository } from "../repositories/gardeningConfig.repository.js";
export declare class GardeningConfigService {
    private repo;
    constructor(repo: GardeningConfigRepository);
    findOne(id: string): Promise<GardeningConfig>;
    findOneOrCreate(id: string): Promise<GardeningConfig>;
    update(config: GardeningConfig): Promise<GardeningConfig>;
    getAll(): Promise<GardeningConfig[]>;
}
//# sourceMappingURL=gardeningConfig.service.d.ts.map