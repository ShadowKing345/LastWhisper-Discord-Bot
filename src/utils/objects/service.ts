import { RepositoryBase, IEntity } from "./repositoryBase.js";
import { MergeObjectBase } from "./mergeObjectBase.js";
import { ServiceError } from "../errors/index.js";

export abstract class Service<T extends MergeObjectBase<T> & IEntity<unknown>> {
  protected constructor(protected repository: RepositoryBase<T>) {}

  /**
   * Attempts to find or create a new configuration file.
   * @param id The Guild ID to look for. Throws if null was set.
   * @protected
   */
  protected async getConfig(id: string): Promise<T> {
    if (!id) {
      throw new ServiceError("Guild ID cannot be null.");
    }

    const result = await this.repository.findOne({ guildId: id } as T);
    if (result) return result;

    return await this.repository.save({ guildId: id } as T);
  }
}
