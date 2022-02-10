import { RoleManagerConfig } from "../models/roleManager.model.js";
export declare class RoleManagerConfigService {
    private repo;
    constructor();
    findOne(id: string): Promise<RoleManagerConfig>;
    findOneOrCreate(id: string): Promise<RoleManagerConfig>;
    update(config: RoleManagerConfig): Promise<RoleManagerConfig>;
    getAll(): Promise<RoleManagerConfig[]>;
}
