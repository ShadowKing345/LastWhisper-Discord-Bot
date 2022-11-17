import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";

/**
 * Repository for BuffManagerConfig
 * @see BuffManagerConfig
 */
@singleton()
export class BuffManagerRepository extends RepositoryBase<BuffManagerConfig> {
  protected readonly collectionName: string = "buff_manager";
  protected readonly mappingObject = BuffManagerConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
