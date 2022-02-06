import { Filter } from "mongodb";
import { GardeningConfig } from "../models/gardeningConfigModel.js";
export declare class GardeningConfigRepository {
    private static readonly collectionName;
    private collection;
    constructor();
    private validate;
    save(config: GardeningConfig): Promise<GardeningConfig>;
    findOne(filter: Filter<GardeningConfig>): Promise<GardeningConfig>;
    find(filter: Filter<GardeningConfig>): Promise<GardeningConfig[]>;
}
