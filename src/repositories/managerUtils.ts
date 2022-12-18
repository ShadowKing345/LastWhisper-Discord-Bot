import { DatabaseService } from "../config/databaseService.js";
import { ManagerUtilsConfig } from "../entities/managerUtils.js";
import { repository } from "../utils/decorators/index.js";
import { SelfCreatingRepository } from "./base/selfCreatingRepository.js";

/**
 * Repository for ManagerUtilsConfig
 * @see ManagerUtilsConfig
 */
@repository()
export class ManagerUtilsRepository extends SelfCreatingRepository<ManagerUtilsConfig> {
  constructor(db: DatabaseService) {
    super(db, ManagerUtilsConfig);
  }
}
