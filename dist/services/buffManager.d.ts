import { EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { Client } from "../utils/objects/client.js";
import { Buff, Week } from "../entities/buffManager/index.js";
import { Service } from "./service.js";
import { ServiceError } from "../utils/errors/index.js";
import { WeekRepository } from "../repositories/buffManager/weekRepository.js";
import { MessageSettingsRepository } from "../repositories/buffManager/messageSettingsRepository.js";
export declare class BuffManagerService extends Service {
    private logger;
    private readonly weekRepository;
    private readonly messageSettingsRepository;
    constructor(weekRepository: WeekRepository, messageSettingsRepository: MessageSettingsRepository, logger: pino.Logger);
    getBuffByDate(guildId: string | null, date: DateTime): Promise<Buff | null>;
    getWeekByDate(guildId: string | null, date: DateTime): Promise<Week | null>;
    postDailyMessage(client: Client): Promise<void>;
    createBuffEmbed(title: string, buff: Buff, date: DateTime): EmbedBuilder;
    createWeekEmbed(title: string, week: Week, date: DateTime): EmbedBuilder;
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