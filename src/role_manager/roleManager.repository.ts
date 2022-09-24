import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../utils/config/databaseConfiguration.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/index.js";
import { RoleManagerConfig } from "./roleManager.model.js";

@singleton()
export class RoleManagerRepository extends BasicRepository<RoleManagerConfig> {
    private readonly collectionName: string = "role_manager";

    constructor(private db: DatabaseConfiguration) {
        super();
    }

    protected sanitiseOutput(config: RoleManagerConfig): RoleManagerConfig {
        return deepMerge(new RoleManagerConfig(), config);
    }

    protected get collection(): Collection<RoleManagerConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
