import { Client, EmbedBuilder } from "discord.js";
import { Service } from "./service.js";
import { EventManagerSettingsRepository } from "../repositories/eventManager/eventManagerSettingsRepository.js";
import { EventObject } from "../entities/eventManager/index.js";
import { EventObjectRepository } from "../repositories/eventManager/eventObjectRepository.js";
import { EventReminderRepository } from "../repositories/eventManager/eventReminderRepository.js";
export declare class EventManagerService extends Service {
    private logger;
    private readonly eventManagerSettingsRepository;
    private readonly eventObjectRepository;
    private readonly eventReminderRepository;
    constructor(eventManagerSettingsRepository: EventManagerSettingsRepository, eventObjectRepository: EventObjectRepository, eventReminderRepository: EventReminderRepository);
    parseEvent(guildId: string | null, text: string): Promise<EventObject>;
    findByIndex(guildId: string | null, index?: number): Promise<EventObject | EventObject[] | null>;
    createContent(guildId: string | null, name: string, description: string, time: string, additional?: [string, string][]): Promise<string>;
    create(guildId: string | null, id: string, content: string, channelId?: string): Promise<EventObject | null>;
    update(guildId: string | null, messageId: string, content: string): Promise<EventObject | null>;
    updateByIndex(guildId: string | null, index: number, content: string): Promise<EventObject>;
    cancel(guildId: string | null, messageId: string): Promise<void>;
    cancelByIndex(guildId: string | null, index: number): Promise<void>;
    eventExists(guildId: string | null, messageId: string): Promise<boolean>;
    onReady(client: Client): Promise<void>;
    reminderLoop(client: Client): Promise<void>;
    createEventEmbed(event: EventObject): EmbedBuilder;
    private regexpEscape;
    private parseMessage;
}
//# sourceMappingURL=eventManager.d.ts.map