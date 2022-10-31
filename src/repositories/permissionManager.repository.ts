import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { PermissionManagerConfig } from "../models/permission_manager/index.js";

@singleton()
export class PermissionManagerRepository extends RepositoryBase<PermissionManagerConfig> {
  protected readonly collectionName: string = "permission_manager";

  protected readonly mappingObject = PermissionManagerConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
