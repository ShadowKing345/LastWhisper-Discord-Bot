import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "../utils/objects/repository.js";
import { BuffManagerConfig } from "../models/buff_manager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for BuffManagerConfig
 * @see BuffManagerConfig
 */
@repository()
export class BuffManagerRepository extends Repository<BuffManagerConfig> {
  protected readonly collectionName: string = "buff_manager";
  protected readonly mappingObject = BuffManagerConfig;

  constructor(db: DatabaseConfigurationService) {
    super(db);
  }
}
