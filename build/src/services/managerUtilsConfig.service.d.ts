import { ManagerUtilsConfig } from "../models/mangerUtils.model.js";
import { ManagerUtilsConfigRepository } from "../repositories/managerUtilsConfig.repository.js";
export declare class ManagerUtilsConfigService {
    private repo;
    constructor(repo: ManagerUtilsConfigRepository);
    findOne(id: string): Promise<ManagerUtilsConfig>;
    findOneOrCreate(id: string): Promise<ManagerUtilsConfig>;
    update(config: ManagerUtilsConfig): Promise<ManagerUtilsConfig>;
    getAll(): Promise<ManagerUtilsConfig[]>;
}
//# sourceMappingURL=managerUtilsConfig.service.d.ts.map