import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { PermissionManagerConfig } from "../entities/permission_manager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for PermissionManagerConfig
 * @see PermissionManagerConfig
 */
@repository()
export class PermissionManagerRepository extends Repository<PermissionManagerConfig> {
  constructor(db: DatabaseConfigurationService) {
    super(db, PermissionManagerConfig);
  }
}
