import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { GardeningModuleConfig } from "../models/gardening_manager/index.js";

@singleton()
export class GardeningManagerRepository extends RepositoryBase<GardeningModuleConfig> {
    private readonly collectionName: string = "gardening_manager";

    protected readonly sanitizedObject = GardeningModuleConfig;
    protected readonly collection: Collection<GardeningModuleConfig>;

    constructor(db: DatabaseConfigurationService) {
        super();
        this.collection = db.db?.collection(this.collectionName);
    }
}
