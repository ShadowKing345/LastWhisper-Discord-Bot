import { singleton } from "tsyringe";

import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { RepositoryBase } from "../utils/objects/repositoryBase.js";
import { GardeningModuleConfig } from "../models/gardening_manager/index.js";

/**
 * Repository for GardeningModuleConfig
 * @see GardeningModuleConfig
 */
@singleton()
export class GardeningManagerRepository extends RepositoryBase<GardeningModuleConfig> {
  protected readonly collectionName: string = "gardening_manager";
  protected readonly mappingObject = GardeningModuleConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
