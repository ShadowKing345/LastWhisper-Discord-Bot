import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { RoleManagerConfig } from "../entities/roleManager.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for RoleManagerConfig
 * @see RoleManagerConfig
 */
@repository()
export class RoleManagerRepository extends Repository<RoleManagerConfig> {
  constructor(db: DatabaseConfigurationService) {
    super(db, RoleManagerConfig);
  }
}
