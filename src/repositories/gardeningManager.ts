import { DatabaseService } from "../config/databaseService.js";
import { Repository } from "./repository.js";
import { GardeningModuleConfig } from "../entities/gardeningManager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for GardeningModuleConfig
 * @see GardeningModuleConfig
 */
@repository()
export class GardeningManagerRepository extends Repository<GardeningModuleConfig> {
  constructor(db: DatabaseService) {
    super(db, GardeningModuleConfig);
  }
}
