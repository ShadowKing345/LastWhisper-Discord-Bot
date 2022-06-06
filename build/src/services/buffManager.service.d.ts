import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { Client } from "../classes/client.js";
import { Buff, BuffManagerConfig, Week } from "../models/buffManager.model.js";
import { BuffManagerConfigRepository } from "../repositories/buffManagerConfig.repository.js";
export declare class BuffManagerService {
    private buffManagerConfigRepository;
    private readonly logger;
    private readonly daysOfWeek;
    constructor(buffManagerConfigRepository: BuffManagerConfigRepository);
    createBuffEmbed(title: string, day: Buff, date: DateTime): MessageEmbed;
    createWeekEmbed(title: string, week: Week, days: Buff[], date: DateTime): MessageEmbed;
    tryGetConfig(interaction: CommandInteraction): Promise<[BuffManagerConfig, boolean]>;
    postBuff(interaction: CommandInteraction, subCommand: string): Promise<void>;
    postWeeksBuffs(interaction: CommandInteraction, subCommand: string): Promise<void>;
    postDailyMessage(client: Client): Promise<void>;
    private findOneOrCreate;
}
//# sourceMappingURL=buffManager.service.d.ts.map