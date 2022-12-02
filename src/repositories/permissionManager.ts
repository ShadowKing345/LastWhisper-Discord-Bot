import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { PermissionManagerConfig } from "../entities/permission_manager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for PermissionManagerConfig
 * @see PermissionManagerConfig
 */
@repository()
export class PermissionManagerRepository extends Repository<PermissionManagerConfig> {
  protected readonly collectionName: string = "permission_manager";
  protected readonly mappingObject = PermissionManagerConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
