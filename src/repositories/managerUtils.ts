import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for ManagerUtilsConfig
 * @see ManagerUtilsConfig
 */
@repository()
export class ManagerUtilsRepository extends Repository<ManagerUtilsConfig> {
  constructor(db: DatabaseConfigurationService) {
    super(db, ManagerUtilsConfig);
  }
}
