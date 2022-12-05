import { Client, EmbedBuilder } from "discord.js";
import { EventObject } from "../entities/eventManager/index.js";
import { Service } from "./service.js";
import { pino } from "pino";
import { EventManagerConfigRepository } from "../repositories/eventManager/eventManagerConfigRepository.js";
export declare class EventManagerService extends Service {
    private repository;
    private logger;
    constructor(repository: EventManagerConfigRepository, logger: pino.Logger);
    private getConfig;
    parseEvent(guildId: string | null, text: string): Promise<EventObject>;
    findIndex(guildId: string | null, index?: number): Promise<EventObject | EventObject[] | null>;
    createContent(guildId: string | null, name: string, description: string, time: string, additional?: [string, string][]): Promise<string>;
    create(guildId: string | null, id: string, content: string, channelId?: string): Promise<EventObject | null>;
    update(guildId: string | null, messageId: string, content: string): Promise<EventObject | null>;
    updateByIndex(guildId: string | null, index: number, content: string): Promise<EventObject | null>;
    cancel(guildId: string | null, id: string): Promise<void>;
    cancelByIndex(guildId: string | null, index: number): Promise<void>;
    eventExists(guildId: string | null, id: string): Promise<boolean>;
    onReady(client: Client): Promise<void>;
    reminderLoop(client: Client): Promise<void>;
    createEventEmbed(event: EventObject): EmbedBuilder;
    private regexpEscape;
    private parseMessage;
}
//# sourceMappingURL=eventManager.d.ts.map