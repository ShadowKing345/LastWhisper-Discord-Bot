import { injectable } from "tsyringe";

import { Database } from "../config/databaseConfiguration.js";
import { BasicRepository } from "../shared/basicRepository.js";
import { deepMerge } from "../shared/utils.js";
import { PermissionManagerConfig } from "./models/index.js";

@injectable()
export class PermissionManagerRepository extends BasicRepository<PermissionManagerConfig> {
    private readonly collectionName: string = "permission_manager";

    constructor(private db: Database) {
        super();
        this.collection = db.collection(this.collectionName);
    }

    protected sanitiseOutput(config: PermissionManagerConfig): PermissionManagerConfig {
        return deepMerge(new PermissionManagerConfig(), config);
    }
}