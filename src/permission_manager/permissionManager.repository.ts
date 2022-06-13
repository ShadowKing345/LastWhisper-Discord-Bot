import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { deepMerge } from "../shared/utils.js";
import { PermissionManagerConfig } from "./models/index.js";

@singleton()
export class PermissionManagerRepository extends BasicRepository<PermissionManagerConfig> {
    private readonly collectionName: string = "permission_manager";

    constructor(private db: DatabaseConfiguration) {
        super();
    }

    protected sanitiseOutput(config: PermissionManagerConfig): PermissionManagerConfig {
        return deepMerge(new PermissionManagerConfig(), config);
    }

    protected get collection(): Collection<PermissionManagerConfig> {
        return this.db?.db?.collection(this.collectionName);
    }

}