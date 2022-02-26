import { Filter } from "mongodb";
import { ManagerUtilsConfig } from "../models/mangerUtils.model.js";
export declare class ManagerUtilsConfigRepository {
    private static readonly collectionName;
    private collection;
    private validate;
    save(config: ManagerUtilsConfig): Promise<ManagerUtilsConfig>;
    findOne(filter: Filter<ManagerUtilsConfig>): Promise<ManagerUtilsConfig>;
    find(filter: Filter<ManagerUtilsConfig>): Promise<ManagerUtilsConfig[]>;
}
