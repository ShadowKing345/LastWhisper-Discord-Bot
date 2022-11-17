import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { RoleManagerConfig } from "../models/roleManager.js";

/**
 * Repository for RoleManagerConfig
 * @see RoleManagerConfig
 */
@singleton()
export class RoleManagerRepository extends RepositoryBase<RoleManagerConfig> {
  protected readonly collectionName: string = "role_manager";
  protected readonly mappingObject = RoleManagerConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
