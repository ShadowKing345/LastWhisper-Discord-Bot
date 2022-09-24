import { Collection, Filter } from "mongodb";
import { BasicModel } from "../models/index.js";
export declare abstract class RepositoryBase<T extends BasicModel> {
    protected abstract get collection(): Collection<T>;
    save(config: T): Promise<T>;
    findOne(filter: Filter<T>): Promise<T>;
    find(filter: Filter<T>): Promise<T[]>;
    getAll(): Promise<T[]>;
    bulkSave(configs: T[]): Promise<void>;
    protected abstract sanitiseOutput(config: T): T;
}
//# sourceMappingURL=repositoryBase.d.ts.map