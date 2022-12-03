import { DatabaseConfigurationService } from "../utils/config/databaseConfigurationService.js";
import { Repository } from "./repository.js";
import { BuffManagerConfig } from "../entities/buff_manager/index.js";
import { repository } from "../utils/decorators/index.js";

/**
 * Repository for BuffManagerConfig
 * @see BuffManagerConfig
 */
@repository()
export class BuffManagerRepository extends Repository<BuffManagerConfig> {
  constructor(db: DatabaseConfigurationService) {
    super(db, BuffManagerConfig);
  }
}
