import { GardeningConfig } from "../models/gardeningConfig.model.js";
export declare class GardeningConfigService {
    private repo;
    constructor();
    findOne(id: string): Promise<GardeningConfig>;
    findOneOrCreate(id: string): Promise<GardeningConfig>;
    update(config: GardeningConfig): Promise<GardeningConfig>;
    getAll(): Promise<GardeningConfig[]>;
}
