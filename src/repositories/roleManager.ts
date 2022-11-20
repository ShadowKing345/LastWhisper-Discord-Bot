import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { RoleManagerConfig } from "../models/roleManager.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for RoleManagerConfig
 * @see RoleManagerConfig
 */
@repository()
export class RoleManagerRepository extends Repository<RoleManagerConfig> {
  protected readonly collectionName: string = "role_manager";
  protected readonly mappingObject = RoleManagerConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
