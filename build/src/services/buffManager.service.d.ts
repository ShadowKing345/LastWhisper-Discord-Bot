import { CommandInteraction, InteractionResponse, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { Client } from "../utils/models/client.js";
import { BuffManagerRepository } from "../repositories/buffManager.repository.js";
import { Buff, BuffManagerConfig, Week } from "../models/buff_manager/index.js";
export declare class BuffManagerService {
    private buffManagerConfigRepository;
    private logger;
    private readonly daysOfWeek;
    constructor(buffManagerConfigRepository: BuffManagerRepository, logger: pino.Logger);
    private static getBuffId;
    private static daysToArray;
    createBuffEmbed(title: string, day: Buff, date: DateTime): EmbedBuilder;
    createWeekEmbed(title: string, week: Week, days: Buff[], date: DateTime): EmbedBuilder;
    tryGetConfig(interaction: CommandInteraction): Promise<[BuffManagerConfig, boolean]>;
    postBuff(interaction: CommandInteraction, today?: boolean): Promise<InteractionResponse<boolean>>;
    postWeeksBuffs(interaction: CommandInteraction, thisWeek?: boolean): Promise<InteractionResponse<boolean>>;
    postDailyMessage(client: Client): Promise<void>;
    private findOneOrCreate;
}
//# sourceMappingURL=buffManager.service.d.ts.map