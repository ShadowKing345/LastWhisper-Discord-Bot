import { Repository } from "../repositories/repository.js";
import { ServiceError } from "../utils/errors/index.js";
import { GuildConfigBase } from "../entities/guildConfigBase.js";

export abstract class Service<T extends GuildConfigBase> {
  protected constructor(protected repository: Repository<T>, private entity: { new (): T }) {}

  /**
   * Attempts to find or create a new configuration file.
   * @param guildId The Guild ID to look for. Throws if null was set.
   * @protected
   */
  protected async getConfig(guildId: string): Promise<T> {
    if (!guildId) {
      throw new ServiceError("Guild ID cannot be null.");
    }

    const result = await this.repository.findOne({ where: { guildId: guildId } as never });
    if (result) return result;

    const config = new this.entity();
    config.guildId = guildId;

    return this.repository.save(config);
  }
}
