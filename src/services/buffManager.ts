import { CommandInteraction, InteractionResponse, EmbedBuilder, Channel, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { Timer } from "../utils/objects/timer.js";
import { BuffManagerRepository } from "../repositories/buffManager.js";
import { Buff, BuffManagerConfig, MessageSettings, Week } from "../models/buff_manager/index.js";
import { Service } from "../utils/objects/service.js";

/**
 * Buff manager service.
 * This service manages actions related to FF XIV FC buffs.
 * Obviously not within the game as I am very sure that is against TOS.
 */
@singleton()
export class BuffManagerService extends Service<BuffManagerConfig> {
  private readonly daysOfWeek: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  constructor(repository: BuffManagerRepository, @createLogger(BuffManagerService.name) private logger: pino.Logger) {
    super(repository);
  }

  //region Commands

  /**
   * Creates an interaction response with the buffs for the day requested.
   * @param interaction The interaction from Discord.
   * @param date The date to get the buff information.
   */
  public async postBuff(interaction: CommandInteraction, date: DateTime): Promise<InteractionResponse | void> {
    const config = await this.tryGetConfig(interaction);
    if (!config) return;

    this.logger.debug(`Command invoked for buffs.\nPosting buff message for the date ${date.toISO()}.`);

    const week = config.getWeekOfYear(date);
    const buff = config.getBuff(week.getBuffId(date));

    if (!buff) {
      this.logger.debug(`Buff did not exit.`);
      return interaction.reply({
        content: `Sorry, The buff for the date ${date.toISO()} does not exist in the collection of buffs. Kindly contact a manager or administration to resolve this issue.`,
        ephemeral: true,
      });
    }

    return interaction.reply({ embeds: [this.createBuffEmbed("The Buff Shall Be:", buff, date)] });
  }

  /**
   * Creates an interaction response with the week's buffs information.
   * @param interaction The interaction from Discord.
   * @param date The date to get the buff information.
   */
  public async postWeek(interaction: CommandInteraction, date: DateTime): Promise<InteractionResponse | void> {
    const config = await this.tryGetConfig(interaction);
    if (!config) return;

    this.logger.debug(`Command invoked for weeks.\nPosting week message for ${date.toISO()}.`);
    return interaction.reply({ embeds: [this.createWeekEmbed("The Buffs For The Week Shall Be:", config, date)] });
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
          embeds.push(this.createWeekEmbed(messageSettings.weekMessage, config, now, week));
        }

        await channel.send({ embeds });
      } catch (error) {
        this.logger.error(error instanceof Error ? error.stack : error);
      }
    }
  }

  //endregion

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
   * @param title The title of the embed.
   * @param config The configuration object to get the Buffs and Week data.
   * @param date The date context for the week. Used to get the week and fill in footer data.
   * @param week An optional week object to override the default find week behavior.
   */
  public createWeekEmbed(
    title: string,
    config: BuffManagerConfig,
    date: DateTime,
    week: Week = config.getWeekOfYear(date),
  ): EmbedBuilder {
    this.logger.debug(`Creating Week Embed.`);

    if (!week) {
      throw new Error("Cannot find a valid week.");
    }

    return new EmbedBuilder({
      title: title,
      description: week.title,
      fields: Array(...week.days).map((buffId, index) => {
        const dow: string = this.daysOfWeek[index];
        const day: Buff = config.getBuff(buffId);

        return { name: dow, value: day?.text ?? "No buff found.", inline: true };
      }),
      footer: { text: `Week ${date.get("weekNumber")}.` },
    }).setColor("Random");
  }

  /**
   * Tries to get the configuration object. If none can be found the discord interaction is responded to and null is returned instead.
   * @param interaction The Discord interaction.
   */
  public async tryGetConfig(interaction: CommandInteraction): Promise<BuffManagerConfig | null> {
    const guildId = interaction.guildId;
    this.logger.debug(`Attempting to acquire configuration for guild guildId.`);
    const config: BuffManagerConfig = await this.getConfig(guildId);

    // "Throws" if the number of buffs are less than 1.
    if (config.buffs?.length < 1) {
      this.logger.debug(`No buffs were set in config.`);
      await interaction.reply({
        content: "Sorry, there are not buffs set.",
        ephemeral: true,
      });
      return null;
    }

    // "Throws" if the number of filtered weeks are less than 1.
    if (config.getFilteredWeeks?.length < 1) {
      this.logger.debug(`No weeks were set in config.`);
      await interaction.reply({
        content: "Sorry, there are not enabled weeks set.",
        ephemeral: true,
      });
      return null;
    }

    this.logger.debug(`Returning results.`);
    return config;
  }
}
