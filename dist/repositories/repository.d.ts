import { Repository as Repo, EntityTarget, FindOneOptions, FindManyOptions, FindOptionsWhere } from "typeorm";
import { DatabaseService } from "../config/databaseService.js";
import { EntityBase } from "../entities/entityBase.js";
export declare abstract class Repository<T extends EntityBase> {
    protected db: DatabaseService;
    private entityTarget;
    protected repo: Repo<T>;
    protected constructor(db: DatabaseService, entityTarget: EntityTarget<T>);
    save(obj: T): Promise<T>;
    findOne(filter: FindOneOptions<T>): Promise<T>;
    findAll(filter: FindManyOptions<T>): Promise<T[]>;
    getAll(): Promise<T[]>;
    bulkSave(objs: T[]): Promise<T[]>;
    delete(filter: FindOptionsWhere<T>): Promise<void>;
    private isConnected;
}
//# sourceMappingURL=repository.d.ts.map