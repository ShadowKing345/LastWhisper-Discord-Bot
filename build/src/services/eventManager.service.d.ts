import { Client, Message, ChatInputCommandInteraction, PartialMessage } from "discord.js";
import { Duration } from "luxon";
import { EventManagerRepository } from "../repositories/eventManager.repository.js";
export declare class EventManagerService {
    private eventManagerRepository;
    constructor(eventManagerRepository: EventManagerRepository);
    protected static parseTriggerDuration(triggerTime: string): Duration;
    private parseMessage;
    private getConfig;
    createEvent(message: Message): Promise<void>;
    updateEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void>;
    deleteEvent(message: Message | PartialMessage): Promise<void>;
    reminderLoop(client: Client): Promise<void>;
    listEvents(interaction: ChatInputCommandInteraction): Promise<void>;
    onReady(client: Client): Promise<void>;
    private findOneOrCreate;
}
//# sourceMappingURL=eventManager.service.d.ts.map