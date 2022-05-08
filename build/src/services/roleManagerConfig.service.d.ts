import { RoleManagerConfig } from "../models/roleManager.model.js";
import { RoleManagerConfigRepository } from "../repositories/roleManagerConfig.repository.js";
export declare class RoleManagerConfigService {
    private repo;
    constructor(repo: RoleManagerConfigRepository);
    findOne(id: string): Promise<RoleManagerConfig>;
    findOneOrCreate(id: string): Promise<RoleManagerConfig>;
    update(config: RoleManagerConfig): Promise<RoleManagerConfig>;
    getAll(): Promise<RoleManagerConfig[]>;
}
//# sourceMappingURL=roleManagerConfig.service.d.ts.map