import { Client, CommandInteraction, Message } from "discord.js";
import { EventManagerRepository } from "../repositories/eventManager.repository.js";
export declare class EventManagerService {
    private repo;
    constructor(repo: EventManagerRepository);
    private static parseTriggerDuration;
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