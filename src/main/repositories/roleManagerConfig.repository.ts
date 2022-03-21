import {Database} from "../config/databaseConfiguration.js";
import {RoleManagerConfig} from "../models/roleManager.model.js";
import {injectable} from "tsyringe";
import {BasicRepository} from "./basicRepository.js";

@injectable()
export class RoleManagerConfigRepository extends BasicRepository<RoleManagerConfig> {
    private readonly collectionName: string = "role_manager";

    constructor(protected db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: RoleManagerConfig): RoleManagerConfig {
        return Object.assign(new RoleManagerConfig(), config);
    }
}
