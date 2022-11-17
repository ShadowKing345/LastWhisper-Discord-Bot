import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { ManagerUtilsConfig } from "../models/managerUtils.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for ManagerUtilsConfig
 * @see ManagerUtilsConfig
 */
@repository()
export class ManagerUtilsRepository extends Repository<ManagerUtilsConfig> {
  protected readonly collectionName: string = "manager_utils";
  protected readonly mappingObject = ManagerUtilsConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
