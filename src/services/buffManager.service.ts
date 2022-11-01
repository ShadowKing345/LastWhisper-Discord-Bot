import { CommandInteraction, TextChannel, InteractionResponse, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../utils/loggerService.js";
import { Client } from "../utils/models/client.js";
import { Timer } from "../utils/objects/timer.js";
import { BuffManagerRepository } from "../repositories/buffManager.repository.js";
import { Buff, BuffManagerConfig, Days, MessageSettings, Week } from "../models/buff_manager/index.js";

/**
 * Todo: Global filtering of buffs and weeks.
 * Buff manager service.
 * This service manages actions related to FFXIV FC buffs.
 * Obviously not within the game as I am very sure that is against TOS.
 */
@singleton()
export class BuffManagerService {
  private readonly daysOfWeek: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  constructor(
    private buffManagerConfigRepository: BuffManagerRepository,
    @createLogger(BuffManagerService.name) private logger: pino.Logger
  ) {
  }

  //region Discord API

  /**
   * Creates an interaction response with the buffs for the day requested.
   * @param interaction The interaction from Discord.
   * @param date The date to get the buff information.
   */
  public async postBuff(interaction: CommandInteraction, date: DateTime): Promise<InteractionResponse | void> {
    const [ config, flag ] = await this.tryGetConfig(interaction);
    if (!flag) {
      return;
    }

    this.logger.debug(`Command invoked for buffs.`);
    this.logger.debug(`Posting buff message for the date ${date.toISO()}`);

    const week = config.weeks[date.get("weekNumber") % config.weeks.length];
    const buffId = BuffManagerService.getBuffId(week, date);
    const buff = config.buffs.find((day) => day.id === buffId);

    if (!buff) {
      await interaction.reply({
        content: `Sorry, but the buff with id **${buffId}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
        ephemeral: true
      });
      this.logger.debug(`Buff with id buffId does not exist.`);
      return;
    }

    await interaction.reply({
      embeds: [ this.createBuffEmbed("The Buff Shall Be:", buff, date) ]
    });
  }

  /**
   * Creates an interaction response with the week's buffs information.
   * @param interaction The interaction from Discord.
   * @param date The date to get the buff information.
   */
  public async postWeek(interaction: CommandInteraction, date: DateTime): Promise<InteractionResponse | void> {
    const [ config, flag ] = await this.tryGetConfig(interaction);
    if (!flag) {
      return;
    }

    this.logger.debug(`Command invoked for weeks.`);
    this.logger.debug(`Posting week message for ${date.toISO()}`);

    const filteredWeeks = config.weeks.filter((week) => week.isEnabled);
    const week = filteredWeeks[date.get("weekNumber") % filteredWeeks.length];
    await interaction.reply({
      embeds: [ this.createWeekEmbed("The Buffs For The Week Shall Be:", week, config.buffs, date) ]
    });
  }

  /**
   * Posts a daily message based on the configuration of the guild.
   * @param client The discord client.
   */
  public async postDailyMessage(client: Client): Promise<void> {
    await Timer.waitTillReady(client);
    this.logger.debug("Posting daily buff message.");

    const configs: BuffManagerConfig[] = (await this.buffManagerConfigRepository.getAll()).filter((config) => client.guilds.cache.has(config.guildId) && config.buffs.length > 0);
    const now: DateTime = DateTime.now();

    for (const config of configs) {
      try {
        const messageSettings: MessageSettings = config.messageSettings;
        if (!messageSettings.channelId || !messageSettings.hour) continue;
        if (!now.hasSame(DateTime.fromFormat(messageSettings.hour, "HH:mm"), "minute")) {
          continue;
        }

        const channel: TextChannel | null = (await client.channels.fetch(messageSettings.channelId)) as TextChannel | null;
        if (!(channel?.isTextBased && channel.guildId === config.guildId)) {
          this.logger.warn(`Invalid channel messageSettings.channelId  ID for guild config.guildId. Skipping...`);
          continue;
        }

        const filteredWeeks = config.weeks.filter((week) => week.isEnabled);
        const week: Week = filteredWeeks[now.weekNumber % filteredWeeks.length];
        const buffId: string = BuffManagerService.getBuffId(week, now);
        const buff: Buff = config.buffs.find((day) => day.id === buffId);

        const embeds: EmbedBuilder[] = [];

        if (!buff) {
          this.logger.warn(`Invalid buff ID buffId for guild config.guildId. Skipping...`);
          continue;
        }

        this.logger.debug(`Posting buff message.`);
        embeds.push(this.createBuffEmbed(messageSettings.buffMessage, buff, now));

        if (messageSettings.dow !== null && messageSettings.dow === now.weekday) {
          this.logger.debug(`Posting week message.`);
          embeds.push(this.createWeekEmbed(messageSettings.weekMessage, week, config.buffs, now));
        }

        await channel.send({ embeds });
      } catch (error) {
        this.logger.error(error instanceof Error ? error.stack : error);
      }
    }
  }

  //endregion

  private static getBuffId(week: Week, date: DateTime): string {
    return BuffManagerService.daysToArray(week.days)[date.weekday - 1];
  }

  private static daysToArray(days: Days): string[] {
    return [
      days.monday,
      days.tuesday,
      days.wednesday,
      days.thursday,
      days.friday,
      days.saturday,
      days.sunday
    ];
  }

  public createBuffEmbed(title: string, day: Buff, date: DateTime): EmbedBuilder {
    this.logger.debug(`Creating Buff Embed.`);
    return new EmbedBuilder({
      title: title,
      description: day.text,
      thumbnail: { url: day.imageUrl },
      footer: { text: date.toFormat("DDDD") }
    }).setColor("Random");
  }

  public createWeekEmbed(title: string, week: Week, days: Buff[], date: DateTime): EmbedBuilder {
    this.logger.debug(`Creating Week Embed.`);
    return new EmbedBuilder({
      title: title,
      description: week.title,
      fields: BuffManagerService.daysToArray(week.days).map((dayId, index) => {
        const dow: string = this.daysOfWeek[index];
        const day: Buff =
          days.find((entry) => entry.id === dayId) ??
          ({ text: "No Buff Found!" } as Buff);

        return { name: dow, value: day.text, inline: true };
      }),
      footer: { text: `Week ${date.get("weekNumber")}.` }
    }).setColor("Random");
  }

  public async tryGetConfig(interaction: CommandInteraction): Promise<[ BuffManagerConfig, boolean ]> {
    const guildId = interaction.guildId;
    this.logger.debug(`Attempting to acquire configuration for guild guildId.`);
    const config: BuffManagerConfig = await this.findOneOrCreate(guildId);

    if (config.buffs.length <= 0) {
      await interaction.reply({
        content: "Sorry, there are not buffs set.",
        ephemeral: true
      });
      this.logger.debug(`No buffs were set in config.`);
      return [ null, false ];
    }

    if (config.weeks.filter((week) => !("isEnabled" in week) || week.isEnabled).length <= 0) {
      await interaction.reply({
        content: "Sorry, there are not enabled weeks set.",
        ephemeral: true
      });
      this.logger.debug(`No weeks were set in config.`);
      return [ null, false ];
    }

    this.logger.debug(`Returning results.`);
    return [ config, true ];
  }

  private async findOneOrCreate(id: string): Promise<BuffManagerConfig> {
    if (!id) {
      throw new Error("Guild ID cannot be null.");
    }

    let result = await this.buffManagerConfigRepository.findOne({
      guildId: id
    });
    if (result) return result;

    result = new BuffManagerConfig();
    result.guildId = id;

    return await this.buffManagerConfigRepository.save(result);
  }
}
