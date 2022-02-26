import { Filter } from "mongodb";
import { GardeningConfig } from "../models/gardeningConfig.model.js";
export declare class GardeningConfigRepository {
    private static readonly collectionName;
    private collection;
    private validate;
    save(config: GardeningConfig): Promise<GardeningConfig>;
    findOne(filter: Filter<GardeningConfig>): Promise<GardeningConfig>;
    find(filter: Filter<GardeningConfig>): Promise<GardeningConfig[]>;
}
