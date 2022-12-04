import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for ManagerUtilsConfig
 * @see ManagerUtilsConfig
 */
@repository()
export class ManagerUtilsRepository extends Repository<ManagerUtilsConfig> {
  constructor(db: DatabaseService) {
    super(db, ManagerUtilsConfig);
  }
}
