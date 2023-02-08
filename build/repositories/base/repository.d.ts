import { EntityTarget, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository as Repo } from "typeorm";
import { DatabaseService } from "../../config/index.js";
import { EntityBase } from "../../entities/entityBase.js";
export declare abstract class Repository<T extends EntityBase> {
    protected db: DatabaseService;
    protected entityTarget: EntityTarget<T>;
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