import { EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { Bot } from "../objects/bot.js";
import { Buff, Week } from "../entities/buffManager/index.js";
import { Service } from "./service.js";
import { ServiceError } from "../utils/errors/index.js";
import { WeekRepository } from "../repositories/buffManager/weekRepository.js";
import { BuffManagerSettingsRepository } from "../repositories/buffManager/buffManagerSettingsRepository.js";
export declare class BuffManagerService extends Service {
    private logger;
    private readonly weekRepository;
    private readonly buffManagerSettingsRepository;
    constructor(weekRepository: WeekRepository, messageSettingsRepository: BuffManagerSettingsRepository);
    getBuffByDate(guildId: string, date: DateTime): Promise<Buff | null>;
    getWeekByDate(guildId: string, date: DateTime): Promise<Week | null>;
    postDailyMessage(client: Bot): Promise<void>;
    createBuffEmbed(title: string, buff: Buff, date: DateTime): EmbedBuilder;
    createWeekEmbed(title: string, week: Week, date: DateTime): Promise<EmbedBuilder>;
}
export declare class BuffManagerTryGetError extends ServiceError {
    reason: BuffManagerTryGetErrorReasons;
    constructor(message: string, reason: BuffManagerTryGetErrorReasons);
}
export declare enum BuffManagerTryGetErrorReasons {
    UNKNOWN = 0,
    WEEKS = 1,
    BUFFS = 2
}
//# sourceMappingURL=buffManager.d.ts.map