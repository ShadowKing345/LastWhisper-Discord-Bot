import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { singleton } from "tsyringe";

import { createLogger } from "../utils/logger/logger.decorator.js";
import { Client } from "../utils/models/client.js";
import { Task } from "../utils/models/task.js";
import { BuffManagerRepository } from "../repositories/buffManager.repository.js";
import { Buff, BuffManagerConfig, Days, MessageSettings, Week } from "../models/buff_manager/index.js";

const skipping = "Skipping";

@singleton()
export class BuffManagerService {
    private readonly daysOfWeek: string[] = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];

    constructor(
        private buffManagerConfigRepository: BuffManagerRepository,
        @createLogger(BuffManagerService.name) private logger: pino.Logger,
    ) {
    }

    private static getBuffId(week: Week, date: DateTime): string {
        return BuffManagerService.daysToArray(week.days)[date.weekday - 1];
    }

    private static daysToArray(days: Days): string[] {
        return [ days.monday, days.tuesday, days.wednesday, days.thursday, days.friday, days.saturday, days.sunday ];
    }

    public createBuffEmbed(title: string, day: Buff, date: DateTime): MessageEmbed {
        this.logger.debug(`Creating Buff Embed.`);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: day.text,
            thumbnail: { url: day.imageUrl },
            footer: { text: date.toFormat("DDDD") },
        });
    }

    public createWeekEmbed(title: string, week: Week, days: Buff[], date: DateTime): MessageEmbed {
        this.logger.debug(`Creating Week Embed.`);
        return new MessageEmbed({
            color: "RANDOM",
            title: title,
            description: week.title,
            fields: BuffManagerService.daysToArray(week.days).map((dayId, index) => {
                const dow: string = this.daysOfWeek[index];
                const day: Buff = days.find(entry => entry.id === dayId) ?? { text: "No Buff Found!" } as Buff;

                return { name: dow, value: day.text, inline: true };
            }),
            footer: { text: `Week ${date.get("weekNumber")}.` },
        });
    }

    public async tryGetConfig(interaction: CommandInteraction): Promise<[ BuffManagerConfig, boolean ]> {
        const guildId = interaction.guildId;
        this.logger.debug(`Attempting to acquire configuration for guild guildId.`);
        const config: BuffManagerConfig = await this.findOneOrCreate(guildId);

        if (config.buffs.length <= 0) {
            await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true });
            this.logger.debug(`No buffs were set in config.`);
            return [ null, false ];
        }

        if (config.weeks.filter(week => !("isEnabled" in week) || week.isEnabled).length <= 0) {
            await interaction.reply({ content: "Sorry, there are not enabled weeks set.", ephemeral: true });
            this.logger.debug(`No weeks were set in config.`);
            return [ null, false ];
        }

        this.logger.debug(`Returning results.`);
        return [ config, true ];
    }

    public async postBuff(interaction: CommandInteraction, today = true): Promise<void> {
        const [ config, flag ] = await this.tryGetConfig(interaction);
        if (!flag) {
            return;
        }

        this.logger.debug(`Command invoked for buffs.`);

        const date = today ? DateTime.now() : DateTime.now().plus({ days: 1 });
        const title = `${today ? "Today's" : "Tomorrow's"} Buff Shall Be:`;

        this.logger.debug(`Posting buff message for the date ${date.toISO()}`);
        const week = config.weeks[date.get("weekNumber") % config.weeks.length];
        const buffId = BuffManagerService.getBuffId(week, date);
        const buff = config.buffs.find(day => day.id === buffId);

        if (!buff) {
            await interaction.reply({
                content: `Sorry, but the buff with id **${buffId}** does not actually exist!\nKindly contact your FC Admin / Manager to fix this issue.`,
                ephemeral: true,
            });
            this.logger.debug(`Buff with id buffId does not exist.`);
            return;
        }

        await interaction.reply({ embeds: [ this.createBuffEmbed(title, buff, date) ] });
    }

    public async postWeeksBuffs(interaction: CommandInteraction, thisWeek = true): Promise<void> {
        const [ config, flag ] = await this.tryGetConfig(interaction);
        if (!flag) {
            return;
        }

        this.logger.debug(`Command invoked for weeks.`);

        const date = thisWeek ? DateTime.now() : DateTime.now().plus({ week: 1 });
        const title = `The Buffs For ${thisWeek ? "The" : "Next"} Week Shall Be:`;

        this.logger.debug(`Posting week message for ${date.toISO()}`);
        const filteredWeeks = config.weeks.filter(week => week.isEnabled);
        const week = filteredWeeks[date.get("weekNumber") % filteredWeeks.length];
        await interaction.reply({ embeds: [ this.createWeekEmbed(title, week, config.buffs, date) ] });
    }

    public async postDailyMessage(client: Client): Promise<void> {
        if (!client.isReady()) {
            await Task.waitTillReady(client);
        }
        this.logger.debug("Posting daily buff message.");

        const configs: BuffManagerConfig[] = (await this.buffManagerConfigRepository.getAll())
            .filter(config => client.guilds.cache.has(config.guildId) && config.buffs.length > 0);
        const now: DateTime = DateTime.now();

        for (const config of configs) {
            try {
                const messageSettings: MessageSettings = config.messageSettings as MessageSettings;
                if (!messageSettings.channelId || !messageSettings.hour) continue;
                if (!now.hasSame(DateTime.fromFormat(messageSettings.hour, "HH:mm"), "minute")) continue;

                const channel: TextChannel | null = await client.channels.fetch(messageSettings.channelId) as TextChannel | null;
                if (!(channel?.isText && channel.guildId === config.guildId)) {
                    this.logger.warn(`Invalid channel messageSettings.channelId  ID for guild config.guildId. ${skipping}...`);
                    continue;
                }

                const filteredWeeks = config.weeks.filter(week => week.isEnabled);
                const week: Week = filteredWeeks[now.weekNumber % filteredWeeks.length];
                const buffId: string = BuffManagerService.getBuffId(week, now);
                const buff: Buff = config.buffs.find(day => day.id === buffId);

                if (!buff) {
                    this.logger.warn(`Invalid buff ID buffId for guild config.guildId. ${skipping}...`);
                    continue;
                }

                this.logger.debug(`Posting buff message.`);
                await channel.send({ embeds: [ this.createBuffEmbed(messageSettings.buffMessage, buff, now) ] });

                if (messageSettings.dow !== null && messageSettings.dow === now.weekday) {
                    this.logger.debug(`Posting week message.`);
                    await channel.send({
                        embeds: [ this.createWeekEmbed(messageSettings.weekMessage, week, config.buffs, now) ],
                    });
                }
            } catch (error: Error | unknown) {
                this.logger.error(error instanceof Error ? error + error.stack : error);
            }
        }
    }

    private async findOneOrCreate(id: string): Promise<BuffManagerConfig> {
        let result = await this.buffManagerConfigRepository.findOne({ guildId: id });
        if (result) return result;

        result = new BuffManagerConfig();
        result.guildId = id;

        return await this.buffManagerConfigRepository.save(result);
    }
}
