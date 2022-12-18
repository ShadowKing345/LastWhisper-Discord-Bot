import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./base/repository.js";
import { PermissionManagerConfig } from "../entities/permissionManager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for PermissionManagerConfig
 * @see PermissionManagerConfig
 */
@repository()
export class PermissionManagerRepository extends Repository<PermissionManagerConfig> {
  constructor(db: DatabaseService) {
    super(db, PermissionManagerConfig);
  }
}
