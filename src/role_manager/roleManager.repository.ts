import {injectable} from "tsyringe";

import {Database} from "../config/databaseConfiguration.js";
import {BasicRepository} from "../shared/basicRepository.js";
import {deepMerge} from "../shared/utils.js";
import {RoleManagerConfig} from "./roleManager.model.js";

@injectable()
export class RoleManagerRepository extends BasicRepository<RoleManagerConfig> {
    private readonly collectionName: string = "role_manager";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: RoleManagerConfig): RoleManagerConfig {
        return deepMerge(new RoleManagerConfig(), config);
    }
}
