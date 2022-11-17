import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { GardeningModuleConfig } from "../models/gardening_manager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for GardeningModuleConfig
 * @see GardeningModuleConfig
 */
@repository()
export class GardeningManagerRepository extends Repository<GardeningModuleConfig> {
  protected readonly collectionName: string = "gardening_manager";
  protected readonly mappingObject = GardeningModuleConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
