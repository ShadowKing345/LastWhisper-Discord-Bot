import { EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { Client } from "../utils/objects/client.js";
import { BuffManagerRepository } from "../repositories/buffManager.js";
import { Buff, BuffManagerConfig, WeekDTO } from "../entities/buff_manager/index.js";
import { Service } from "./service.js";
import { ServiceError } from "../utils/errors/index.js";
export declare class BuffManagerService extends Service<BuffManagerConfig> {
    private logger;
    constructor(repository: BuffManagerRepository, logger: pino.Logger);
    getBuffByDate(guildId: string | null, date: DateTime): Promise<Buff | null>;
    getWeekByDate(guildId: string | null, date: DateTime): Promise<WeekDTO | null>;
    postDailyMessage(client: Client): Promise<void>;
    createBuffEmbed(title: string, buff: Buff, date: DateTime): EmbedBuilder;
    createWeekEmbed(title: string, week: WeekDTO, date: DateTime): EmbedBuilder;
    tryGetConfig(guildId: string | null): Promise<BuffManagerConfig>;
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