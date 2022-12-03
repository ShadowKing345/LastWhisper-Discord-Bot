import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { GardeningModuleConfig } from "../entities/gardening_manager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for GardeningModuleConfig
 * @see GardeningModuleConfig
 */
@repository()
export class GardeningManagerRepository extends Repository<GardeningModuleConfig> {
  constructor(db: DatabaseConfigurationService) {
    super(db, GardeningModuleConfig);
  }
}
