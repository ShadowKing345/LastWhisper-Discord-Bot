import { Repository } from "./repository.js";
import { DatabaseService } from "../../config/databaseService.js";
import { EntityTarget, FindOptionsWhere } from "typeorm";
import { EntityBase } from "../../entities/entityBase.js";

export abstract class SelfCreatingRepository<T extends EntityBase> extends Repository<T> {
  protected constructor(db: DatabaseService, entity: EntityTarget<T>) {
    super(db, entity);
  }

  /**
   * Attempts to find a given object with a guild ID.
   * If none can be found creates said object instead.
   */
  public async findOneOrCreateByGuildId(guildId: string): Promise<T> {
    return await this.repo.findOne({ where: { guildId } as FindOptionsWhere<T> })
      .then(result =>
        !result
          ? this.repo.save({ guildId } as T)
          : Promise.resolve(result),
      );
  }
}