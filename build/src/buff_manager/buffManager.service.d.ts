import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { Client } from "../utils/models/client.js";
import { BuffManagerRepository } from "./buffManager.repository.js";
import { Buff, BuffManagerConfig, Week } from "./models/index.js";
export declare class BuffManagerService {
    private buffManagerConfigRepository;
    private logger;
    private readonly daysOfWeek;
    constructor(buffManagerConfigRepository: BuffManagerRepository, logger: pino.Logger);
    private static getBuffId;
    private static daysToArray;
    createBuffEmbed(title: string, day: Buff, date: DateTime): MessageEmbed;
    createWeekEmbed(title: string, week: Week, days: Buff[], date: DateTime): MessageEmbed;
    tryGetConfig(interaction: CommandInteraction): Promise<[BuffManagerConfig, boolean]>;
    postBuff(interaction: CommandInteraction, today?: boolean): Promise<void>;
    postWeeksBuffs(interaction: CommandInteraction, thisWeek?: boolean): Promise<void>;
    postDailyMessage(client: Client): Promise<void>;
    private findOneOrCreate;
}
//# sourceMappingURL=buffManager.service.d.ts.map