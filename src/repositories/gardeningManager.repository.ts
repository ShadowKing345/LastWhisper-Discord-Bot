import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { GardeningConfig } from "../gardening_manager/index.js";

@singleton()
export class GardeningManagerRepository extends RepositoryBase<GardeningConfig> {
    private readonly collectionName: string = "gardening_manager";

    protected readonly sanitizedObject = GardeningConfig;
    protected readonly collection: Collection<GardeningConfig>;

    constructor(db: DatabaseConfigurationService) {
        super();
        this.collection = db.db?.collection(this.collectionName);
    }
}
