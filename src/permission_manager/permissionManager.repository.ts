import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/index.js";
import { PermissionManagerConfig } from "./models/index.js";

@singleton()
export class PermissionManagerRepository extends BasicRepository<PermissionManagerConfig> {
    private readonly collectionName: string = "permission_manager";

    constructor(private db: DatabaseConfigurationService) {
        super();
    }

    protected sanitiseOutput(config: PermissionManagerConfig): PermissionManagerConfig {
        return deepMerge(new PermissionManagerConfig(), config);
    }

    protected get collection(): Collection<PermissionManagerConfig> {
        return this.db?.db?.collection(this.collectionName);
    }

}