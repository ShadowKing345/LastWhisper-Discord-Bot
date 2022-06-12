import { Client, CommandInteraction, Message } from "discord.js";
import { injectable } from "tsyringe";

import { ModuleBase } from "../shared/models/moduleBase.js";
import { EventManagerService } from "./eventManager.service.js";

@injectable()
export class EventManagerModule extends ModuleBase {

    constructor(private eventManagerService: EventManagerService) {
        super();

        this.moduleName = "EventManager";
        this.commands = [
            {
                command: builder => builder
                    .setName("event")
                    .setDescription("Displays events.")
                    .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0")),
                run: async interaction => this.listEvents(interaction),
            },
        ];
        this.listeners = [
            { event: "messageCreate", run: async (_, message) => this.createEvent(message) },
            { event: "messageUpdate", run: async (_, old, message) => this.updateEvent(old, message) },
            { event: "messageDelete", run: async (_, message) => await this.deleteEvent(message) },
            { event: "ready", run: async client => this.onReady(client) },
        ];
        this.tasks = [
            {
                name: `${this.moduleName}#postMessageTask`,
                timeout: 60000,
                run: async client => await this.reminderLoop(client),
            },
        ];
    }

    private createEvent(message: Message): Promise<void> {
        return this.eventManagerService.createEvent(message);
    }

    private updateEvent(oldMessage: Message, newMessage: Message): Promise<void> {
        return this.eventManagerService.updateEvent(oldMessage, newMessage);
    }

    private deleteEvent(message: Message): Promise<void> {
        return this.eventManagerService.deleteEvent(message);
    }

    private reminderLoop(client: Client): Promise<void> {
        return this.eventManagerService.reminderLoop(client);
    }

    private listEvents(interaction: CommandInteraction): Promise<void> {
        return this.eventManagerService.listEvents(interaction);
    }

    private onReady(client: Client): Promise<void> {
        return this.eventManagerService.onReady(client);
    }
}