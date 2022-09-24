import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { RoleManagerConfig } from "../role_manager/index.js";

@singleton()
export class RoleManagerRepository extends RepositoryBase<RoleManagerConfig> {
    private readonly collectionName: string = "role_manager";

    protected readonly sanitizedObject = RoleManagerConfig;
    protected readonly collection: Collection<RoleManagerConfig>;

    constructor(db: DatabaseConfigurationService) {
        super();
        this.collection = db.db?.collection(this.collectionName);
    }
}
