import { EntityTarget, FindOneOptions, FindManyOptions } from "typeorm";
import { DatabaseService } from "../config/databaseService.js";
import { EntityBase } from "../entities/entityBase.js";
export declare abstract class Repository<T extends EntityBase> {
    protected db: DatabaseService;
    private entityTarget;
    private repo;
    protected constructor(db: DatabaseService, entityTarget: EntityTarget<T>);
    save(obj: T): Promise<T>;
    findOne(filter: FindOneOptions<T>): Promise<T>;
    findAll(filter: FindManyOptions<T>): Promise<T[]>;
    getAll(): Promise<T[]>;
    bulkSave(objs: T[]): Promise<T[]>;
    private isConnected;
}
//# sourceMappingURL=repository.d.ts.map