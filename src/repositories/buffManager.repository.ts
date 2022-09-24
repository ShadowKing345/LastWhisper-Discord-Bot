import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";

@singleton()
export class BuffManagerRepository extends RepositoryBase<BuffManagerConfig> {
    private readonly collectionName: string = "buff_manager";

    protected readonly sanitizedObject = BuffManagerConfig;
    protected readonly collection: Collection<BuffManagerConfig>;

    constructor(db: DatabaseConfigurationService) {
        super();
        this.collection = db.db?.collection(this.collectionName);
    }
}
