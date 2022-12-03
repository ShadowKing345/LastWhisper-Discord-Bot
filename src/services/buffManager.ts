import { EmbedBuilder, Channel, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";

import { createLogger } from "./loggerService.js";
import { Client } from "../utils/objects/client.js";
import { Timer } from "../utils/objects/timer.js";
import { BuffManagerRepository } from "../repositories/buffManager.js";
import { Buff, BuffManagerConfig, MessageSettings, Week, WeekDTO } from "../entities/buff_manager/index.js";
import { Service } from "./service.js";
import { ServiceError } from "../utils/errors/index.js";
import { service } from "../utils/decorators/index.js";

/**
 * Buff manager service.
 * This service manages actions related to FF XIV FC buffs.
 * Obviously not within the game as I am very sure that is against TOS.
 */
@service()
export class BuffManagerService extends Service<BuffManagerConfig> {
  constructor(repository: BuffManagerRepository, @createLogger(BuffManagerService.name) private logger: pino.Logger) {
    super(repository, BuffManagerConfig);
  }

  /**
   * Returns the Buff by the date.
   * @param guildId Guild ID to ge the configuration from.
   * @param date The date to get the buff from.
   */
  public async getBuffByDate(guildId: string | null, date: DateTime): Promise<Buff | null> {
    const config = await this.tryGetConfig(guildId);

    const week = config.getWeekOfYear(date);
    return config.getBuff(week.getBuffId(date));
  }

  /**
   * Returns the WeekDTO by the date.
   * @see WeekDTO
   * @param guildId Guild ID to ge the configuration from.
   * @param date The date to get the buff from.
   */
  public async getWeekByDate(guildId: string | null, date: DateTime): Promise<WeekDTO | null> {
    const config = await this.tryGetConfig(guildId);
    return WeekDTO.map(config.getWeekOfYear(date), config);
  }

  /**
   * Posts a daily message based on the configuration of the guild.
   * @param client The discord client.
   */
  public async postDailyMessage(client: Client): Promise<void> {
    await Timer.waitTillReady(client);
    this.logger.debug("Posting daily buff message.");

    const configs: BuffManagerConfig[] = await this.repository
      .getAll()
      .then(configs => configs.filter(config => client.guilds.cache.has(config.guildId) && config.buffs.length > 0));
    const now: DateTime = DateTime.now();

    for (const config of configs) {
      try {
        const messageSettings: MessageSettings = config.messageSettings;
        if (!messageSettings.channelId || !messageSettings.hour) continue;
        if (!now.hasSame(DateTime.fromFormat(messageSettings.hour, "HH:mm"), "minute")) {
          continue;
        }

        const channel: Channel = await client.channels.fetch(messageSettings.channelId);
        if (!(channel?.type === ChannelType.GuildText && channel.guildId === config.guildId)) {
          this.logger.warn(`Invalid channel ID for a guild. Skipping...`);
          continue;
        }

        const week: Week = config.getWeekOfYear(now);
        const buff: Buff = config.getBuff(week.getBuffId(now));

        const embeds: EmbedBuilder[] = [];
        if (!buff) {
          this.logger.warn(`Invalid buff ID buffId for guild config.guildId. Skipping...`);
          continue;
        }

        this.logger.debug(`Posting buff message.`);
        embeds.push(this.createBuffEmbed(messageSettings.buffMessage, buff, now));

        if (!isNaN(messageSettings.dow) && Number(messageSettings.dow) === now.weekday) {
          this.logger.debug(`Posting week message.`);
          embeds.push(this.createWeekEmbed(messageSettings.weekMessage, WeekDTO.map(week, config), now));
        }

        await channel.send({ embeds });
      } catch (error) {
        this.logger.error(error instanceof Error ? error.stack : error);
      }
    }
  }

  /**
   * Creates a Discord embed for a Buff object.
   * @param title The title of the embed.
   * @param buff The buff object.
   * @param date The date context for the buff. Used for footer data, etc.
   */
  public createBuffEmbed(title: string, buff: Buff, date: DateTime): EmbedBuilder {
    this.logger.debug(`Creating Buff Embed.`);
    return new EmbedBuilder({
      title: title,
      description: buff.text,
      thumbnail: { url: buff.imageUrl },
      footer: { text: date.toFormat("DDDD") },
    }).setColor("Random");
  }

  /**
   * Creates a Discord embed for a Week object.
   * @see WeekDTO
   * @param title The title of the embed.
   * @param week A WeekDTO object ot be used.
   * @param date The date context for the week. Used to get the week and fill in footer data.
   */
  public createWeekEmbed(title: string, week: WeekDTO, date: DateTime): EmbedBuilder {
    this.logger.debug(`Creating Week Embed.`);

    if (!week) {
      throw new Error("Cannot find a valid week.");
    }

    return new EmbedBuilder({
      title: title,
      description: week.title,
      fields: Array(...week.days).map(([day, buff]) => ({
        name: day,
        value: buff?.text ?? "No buff found.",
        inline: true,
      })),
      footer: { text: `Week ${date.get("weekNumber")}.` },
    }).setColor("Random");
  }

  /**
   * Tries to get the configuration object. If none can be found the discord interaction is responded to and null is returned instead.
   * @param guildId The guild ID to get the configs from.
   */
  public async tryGetConfig(guildId: string | null): Promise<BuffManagerConfig> {
    const config: BuffManagerConfig = await this.getConfig(guildId);

    // Throws if the number of buffs are less than 1.
    if ((config.buffs ?? []).length < 1) {
      this.logger.debug(`No buffs were set in config.`);
      throw new BuffManagerTryGetError("No buffs were set", BuffManagerTryGetErrorReasons.BUFFS);
    }

    // Throws if the number of filtered weeks are less than 1.
    if (config.getFilteredWeeks?.length < 1) {
      this.logger.debug(`No weeks were set in config.`);
      throw new BuffManagerTryGetError("No weeks were set", BuffManagerTryGetErrorReasons.WEEKS);
    }

    this.logger.debug(`Returning results.`);
    return config;
  }
}

/**
 * Error thrown when the try get method fails error occurs.
 */
export class BuffManagerTryGetError extends ServiceError {
  constructor(message: string, public reason: BuffManagerTryGetErrorReasons) {
    super(message);
  }
}

export enum BuffManagerTryGetErrorReasons {
  UNKNOWN,
  WEEKS,
  BUFFS,
}
