import { EntityTarget, FindOneOptions, FindManyOptions } from "typeorm";
import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
import { GuildConfigBase } from "../../entities/guildConfigBase.js";
export declare abstract class Repository<T extends GuildConfigBase> {
    db: DatabaseConfigurationService;
    private entityTarget;
    private repo;
    protected constructor(db: DatabaseConfigurationService, entityTarget: EntityTarget<T>);
    save(obj: T): Promise<T>;
    findOne(filter: FindOneOptions<T>): Promise<T>;
    findAll(filter: FindManyOptions<T>): Promise<T[]>;
    getAll(): Promise<T[]>;
    bulkSave(objs: T[]): Promise<T[]>;
    private isConnected;
}
//# sourceMappingURL=repository.d.ts.map