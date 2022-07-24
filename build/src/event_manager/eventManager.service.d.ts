import { Client, CommandInteraction, Message } from "discord.js";
import { Duration } from "luxon";
import { EventManagerRepository } from "./eventManager.repository.js";
export declare class EventManagerService {
    private eventManagerRepository;
    constructor(eventManagerRepository: EventManagerRepository);
    protected static parseTriggerDuration(triggerTime: string): Duration;
    private parseMessage;
    private getConfig;
    createEvent(message: Message): Promise<void>;
    updateEvent(oldMessage: Message, newMessage: Message): Promise<void>;
    deleteEvent(message: Message): Promise<void>;
    reminderLoop(client: Client): Promise<void>;
    listEvents(interaction: CommandInteraction): Promise<void>;
    onReady(client: Client): Promise<void>;
    private findOneOrCreate;
}
//# sourceMappingURL=eventManager.service.d.ts.map