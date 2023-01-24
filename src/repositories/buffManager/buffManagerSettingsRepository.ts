import { IsNull, Not } from "typeorm";
import { DatabaseService } from "../../config/index.js";
import { BuffManagerSettings } from "../../entities/buffManager/index.js";
import { repository } from "../../utils/decorators/index.js";
import { Repository } from "../base/repository.js";

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