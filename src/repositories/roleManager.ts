import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { RoleManagerConfig } from "../entities/roleManager.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for RoleManagerConfig
 * @see RoleManagerConfig
 */
@repository()
export class RoleManagerRepository extends Repository<RoleManagerConfig> {
  constructor(db: DatabaseService) {
    super(db, RoleManagerConfig);
  }
}
