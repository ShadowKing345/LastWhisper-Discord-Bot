import { CommandInteraction, InteractionResponse, EmbedBuilder } from "discord.js";
import { DateTime } from "luxon";
import { pino } from "pino";
import { Client } from "../utils/models/client.js";
import { BuffManagerRepository } from "../repositories/buffManager.repository.js";
import { Buff, BuffManagerConfig, Week } from "../models/buff_manager/index.js";
import { Service } from "../utils/objects/service.js";
export declare class BuffManagerService extends Service<BuffManagerConfig> {
    private logger;
    private readonly daysOfWeek;
    constructor(repository: BuffManagerRepository, logger: pino.Logger);
    postBuff(interaction: CommandInteraction, date: DateTime): Promise<InteractionResponse | void>;
    postWeek(interaction: CommandInteraction, date: DateTime): Promise<InteractionResponse | void>;
    postDailyMessage(client: Client): Promise<void>;
    createBuffEmbed(title: string, buff: Buff, date: DateTime): EmbedBuilder;
    createWeekEmbed(title: string, config: BuffManagerConfig, date: DateTime, week?: Week): EmbedBuilder;
    tryGetConfig(interaction: CommandInteraction): Promise<BuffManagerConfig | null>;
}
//# sourceMappingURL=buffManager.service.d.ts.map