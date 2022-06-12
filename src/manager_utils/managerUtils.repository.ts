import {injectable} from "tsyringe";

import {Database} from "../config/databaseConfiguration.js";
import {BasicRepository} from "../shared/basicRepository.js";
import {deepMerge} from "../shared/utils.js";
import {ManagerUtilsConfig} from "./managerUtils.model.js";

@injectable()
export class ManagerUtilsRepository extends BasicRepository<ManagerUtilsConfig> {
    private readonly collectionName: string = "manager_utils";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig {
        return deepMerge(new ManagerUtilsConfig(), config);
    }
}
