import { Client, Message, ChatInputCommandInteraction, PartialMessage, InteractionResponse } from "discord.js";
import { EventManagerRepository } from "../repositories/eventManager.repository.js";
import { EventManagerConfig } from "../models/event_manager/index.js";
import { Service } from "../utils/objects/service.js";
import { pino } from "pino";
export declare class EventManagerService extends Service<EventManagerConfig> {
    private logger;
    constructor(repository: EventManagerRepository, logger: pino.Logger);
    createEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    updateEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    cancelEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    testEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    listEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    createEvent(message: Message | PartialMessage): Promise<void>;
    updateEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void>;
    deleteEvent(message: Message | PartialMessage): Promise<void>;
    onReady(client: Client): Promise<void>;
    reminderLoop(client: Client): Promise<void>;
    private parseMessage;
    private createEventEmbed;
}
//# sourceMappingURL=eventManager.service.d.ts.map