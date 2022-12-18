import { repository } from "../../utils/decorators/index.js";
import { Buff } from "../../entities/buffManager/index.js";
import { Repository } from "../base/repository.js";
import { DatabaseService } from "../../config/databaseService.js";

@repository()
export class BuffRepository extends Repository<Buff> {
  constructor(db: DatabaseService) {
    super(db, Buff);
  }
}