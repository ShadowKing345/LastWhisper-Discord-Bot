import { ManagerUtilsConfig } from "../models/mangerUtils.model.js";
export declare class ManagerUtilsConfigService {
    private repo;
    constructor();
    findOne(id: string): Promise<ManagerUtilsConfig>;
    findOneOrCreate(id: string): Promise<ManagerUtilsConfig>;
    update(config: ManagerUtilsConfig): Promise<ManagerUtilsConfig>;
    getAll(): Promise<ManagerUtilsConfig[]>;
}
