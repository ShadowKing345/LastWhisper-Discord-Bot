import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { MessageSettings } from "../../entities/buffManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";

@repository()
export class MessageSettingsRepository extends Repository<MessageSettings> {
  constructor(db: DatabaseService) {
    super(db, MessageSettings);
  }
}