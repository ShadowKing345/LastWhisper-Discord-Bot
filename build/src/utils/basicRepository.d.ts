import { Collection, Filter } from "mongodb";
import { BasicModel } from "./models/index.js";
export interface IRepository<T> {
    findOne(filter: Filter<T>): Promise<T>;
    find(filter: Filter<T>): Promise<T[]>;
    save(obj: T): Promise<T>;
    bulkSave(config: T[]): Promise<void>;
}
export declare abstract class BasicRepository<T extends BasicModel> implements IRepository<T> {
    protected abstract get collection(): Collection<T>;
    save(config: T): Promise<T>;
    findOne(filter: Filter<T>): Promise<T>;
    find(filter: Filter<T>): Promise<T[]>;
    getAll(): Promise<T[]>;
    bulkSave(configs: T[]): Promise<void>;
    protected abstract sanitiseOutput(config: T): T;
}
//# sourceMappingURL=basicRepository.d.ts.map