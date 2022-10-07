import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { PermissionManagerConfig } from "../models/permission_manager/index.js";

@singleton()
export class PermissionManagerRepository extends RepositoryBase<PermissionManagerConfig> {
    private readonly collectionName: string = "permission_manager";

    protected readonly sanitizedObject = PermissionManagerConfig;
    protected readonly collection: Collection<PermissionManagerConfig>;

    constructor(db: DatabaseConfigurationService) {
        super();
        this.collection = db.db?.collection(this.collectionName);
    }
}