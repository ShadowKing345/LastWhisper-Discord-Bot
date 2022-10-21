import { Client, Message, ChatInputCommandInteraction, ApplicationCommandOptionType, PartialMessage } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Commands, Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { EventListeners, EventListener } from "../utils/objects/eventListener.js";
import { Timers } from "../utils/objects/timer.js";

@registerModule()
export class EventManagerModule extends ModuleBase {
    public moduleName: string = "EventManager";
    public commands: Commands = [
        new Command({
            name: "event",
            description: "Displays events.",
            options: [
                new CommandOption({
                    name: "index",
                    description: "The index for the event, starting at 0.",
                    type: ApplicationCommandOptionType.Integer,
                }),
            ],
            execute: interaction => this.listEvents(interaction),
        }),
    ];
    public eventListeners: EventListeners = [
        new EventListener("messageCreate", (_, message) => this.createEvent(message)),
        new EventListener("messageUpdate", (_, old, message) => this.updateEvent(old, message)),
        new EventListener("messageDelete", (_, message) => this.deleteEvent(message)),
        new EventListener("ready", client => this.onReady(client)),
    ];
    public timers: Timers = [
        {
            name: `${this.moduleName}#postMessageTask`,
            timeout: 60000,
            execute: client => this.reminderLoop(client),
        },
    ];

    constructor(
        private eventManagerService: EventManagerService,
        permissionManagerService: PermissionManagerService,
        @createLogger(EventManagerModule.name) logger: pino.Logger,
    ) {
        super(permissionManagerService, logger);

        console.log(this.commands[0].build().toJSON());
    }

    private createEvent(message: Message): Promise<void> {
        return this.eventManagerService.createEvent(message);
    }

    private updateEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        return this.eventManagerService.updateEvent(oldMessage, newMessage);
    }

    private deleteEvent(message: Message | PartialMessage): Promise<void> {
        return this.eventManagerService.deleteEvent(message);
    }

    private reminderLoop(client: Client): Promise<void> {
        return this.eventManagerService.reminderLoop(client);
    }

    private listEvents(interaction: ChatInputCommandInteraction): Promise<void> {
        return this.eventManagerService.listEvents(interaction);
    }

    private onReady(client: Client): Promise<void> {
        return this.eventManagerService.onReady(client);
    }
}
