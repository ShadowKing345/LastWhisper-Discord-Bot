import { Collection, Filter } from "mongodb";
import { MergeObjectBase } from "./mergeObjectBase.js";
import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
export interface IEntity<T> {
    _id: T;
    guildId: string;
}
export declare abstract class Repository<T extends MergeObjectBase<T> & IEntity<unknown>> {
    protected db: DatabaseConfigurationService;
    protected abstract readonly collectionName: string;
    private _collection;
    protected abstract readonly mappingObject: {
        new (): T;
    };
    protected constructor(db: DatabaseConfigurationService);
    save(obj: T): Promise<T>;
    findOne(filter: Filter<T>): Promise<T>;
    findAll(filter: Filter<T>): Promise<T[]>;
    getAll(): Promise<T[]>;
    bulkSave(objs: T[]): Promise<void>;
    protected map(source: object): T;
    private validateCollection;
    protected get collection(): Collection<T>;
}
//# sourceMappingURL=repository.d.ts.map