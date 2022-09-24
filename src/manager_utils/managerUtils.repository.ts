import { Collection } from "mongodb";
import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { BasicRepository } from "../utils/basicRepository.js";
import { deepMerge } from "../utils/index.js";
import { ManagerUtilsConfig } from "./managerUtils.model.js";

@singleton()
export class ManagerUtilsRepository extends BasicRepository<ManagerUtilsConfig> {
    private readonly collectionName: string = "manager_utils";

    constructor(private db: DatabaseConfigurationService) {
        super();
    }

    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig {
        return deepMerge(new ManagerUtilsConfig(), config);
    }

    protected get collection(): Collection<ManagerUtilsConfig> {
        return this.db?.db?.collection(this.collectionName);
    }
}
