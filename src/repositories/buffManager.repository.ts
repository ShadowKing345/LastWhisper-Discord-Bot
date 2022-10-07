import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";

@singleton()
export class BuffManagerRepository extends RepositoryBase<BuffManagerConfig> {
    protected readonly collectionName: string = "buff_manager";
    protected readonly sanitizedObject = BuffManagerConfig;

    constructor(db: DatabaseConfigurationService) {
        super(db);
    }
}
