import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { ManagerUtilsConfig } from "../models/manager_utils/managerUtils.model.js";

@singleton()
export class ManagerUtilsRepository extends RepositoryBase<ManagerUtilsConfig> {
    private readonly collectionName: string = "manager_utils";

    protected readonly sanitizedObject = ManagerUtilsConfig;
    protected readonly collection: Collection<ManagerUtilsConfig>;

    constructor(db: DatabaseConfigurationService) {
        super();
        this.collection = db.db?.collection(this.collectionName);
    }
}
