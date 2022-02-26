import { Filter } from "mongodb";
import { RoleManagerConfig } from "../models/roleManager.model.js";
export declare class RoleManagerConfigRepository {
    private static readonly collectionName;
    private collection;
    constructor();
    private validate;
    save(config: RoleManagerConfig): Promise<RoleManagerConfig>;
    findOne(filter: Filter<RoleManagerConfig>): Promise<RoleManagerConfig>;
    find(filter: Filter<RoleManagerConfig>): Promise<RoleManagerConfig[]>;
}
