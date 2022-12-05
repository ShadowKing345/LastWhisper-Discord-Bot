import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../repository.js";
import { BuffManagerSettings } from "../../entities/buffManager/index.js";
import { DatabaseService } from "../../config/databaseService.js";
import { IsNull, Not } from "typeorm";

@repository()
export class BuffManagerSettingsRepository extends Repository<BuffManagerSettings> {
  constructor(db: DatabaseService) {
    super(db, BuffManagerSettings);
  }

  public getActiveSettings(): Promise<BuffManagerSettings[]> {
    return this.repo.findBy({
      channelId: Not(IsNull()),
      hour: Not(IsNull()),
      dow: Not(IsNull()),
    });
  }
}