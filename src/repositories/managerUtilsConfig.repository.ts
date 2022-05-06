import {injectable} from "tsyringe";

import {Database} from "../config/databaseConfiguration.js";
import {ManagerUtilsConfig} from "../models/mangerUtils.model.js";
import {deepMerge} from "../utils/utils.js";
import {BasicRepository} from "./basicRepository.js";

@injectable()
export class ManagerUtilsConfigRepository extends BasicRepository<ManagerUtilsConfig> {
    private readonly collectionName: string = "manager_utils";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: ManagerUtilsConfig): ManagerUtilsConfig {
        return deepMerge(new ManagerUtilsConfig(), config);
    }
}
