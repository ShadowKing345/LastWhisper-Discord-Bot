import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { ManagerUtilsConfig } from "../models/manager_utils/managerUtils.js";

@singleton()
export class ManagerUtilsRepository extends RepositoryBase<ManagerUtilsConfig> {
  protected readonly collectionName: string = "manager_utils";

  protected readonly mappingObject = ManagerUtilsConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
