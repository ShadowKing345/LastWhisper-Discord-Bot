import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfiguration } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { deepMerge } from "../shared/utils.js";
import { ManagerUtilsConfig } from "./managerUtils.model.js";

@singleton()
export class ManagerUtilsRepository extends BasicRepository<ManagerUtilsConfig> {
    private readonly collectionName: string = "manager_utils";

    constructor(private db: DatabaseConfiguration) {
        super();
    }

    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig {
        return deepMerge(new ManagerUtilsConfig(), config);
    }

    protected get collection(): Collection<ManagerUtilsConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
