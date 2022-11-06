import { Client, EmbedBuilder } from "discord.js";
import { EventManagerRepository } from "../repositories/eventManager.repository.js";
import { EventManagerConfig, EventObj } from "../models/event_manager/index.js";
import { Service } from "../utils/objects/service.js";
import { pino } from "pino";
export declare class EventManagerService extends Service<EventManagerConfig> {
    private logger;
    constructor(repository: EventManagerRepository, logger: pino.Logger);
    parseEvent(guildId: string | null, text: string): Promise<EventObj>;
    findIndex(guildId: string | null, index?: number): Promise<EventObj | EventObj[] | null>;
    create(guildId: string | null, content: string, messageId?: string, channelId?: string): Promise<EventObj | null>;
    createRaw(guildId: string | null, id: string, name: string, description: string, time: string, additional?: [string, string][]): Promise<EventObj | null>;
    update(guildId: string | null, messageId: string, content: string): Promise<EventObj | null>;
    cancel(guildId: string | null, messageId: string): Promise<void>;
    eventExists(guildId: string | null, id: string): Promise<boolean>;
    onReady(client: Client): Promise<void>;
    reminderLoop(client: Client): Promise<void>;
    createEventEmbed(event: EventObj): EmbedBuilder;
    private regexpEscape;
    private parseMessage;
}
//# sourceMappingURL=eventManager.service.d.ts.map