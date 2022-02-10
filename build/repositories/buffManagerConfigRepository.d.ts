import { Filter } from "mongodb";
import { BuffManagerConfig } from "../models/buffManager.model.js";
export declare class BuffManagerConfigRepository {
    private static readonly collectionName;
    private collection;
    constructor();
    private validate;
    save(config: BuffManagerConfig): Promise<BuffManagerConfig>;
    findOne(filter: Filter<BuffManagerConfig>): Promise<BuffManagerConfig>;
    find(filter: Filter<BuffManagerConfig>): Promise<BuffManagerConfig[]>;
    private sanitiseOutput;
}
