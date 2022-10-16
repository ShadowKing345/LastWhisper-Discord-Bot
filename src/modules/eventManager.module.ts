import { Client, Message, ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { ModuleBase, EventListener, Task } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilders, CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";

@registerModule()
export class EventManagerModule extends ModuleBase {
    public moduleName: string = "EventManager";
    public commands: CommandBuilders = [
        new CommandBuilder({
            name: "event",
            description: "Displays events.",
            options: [
                new CommandBuilderOption({
                    name: "index",
                    description: "The index for the event, starting at 0.",
                    type: ApplicationCommandOptionType.Integer,
                }),
            ],
            execute: interaction => this.listEvents(interaction),
        }),
    ];
    public listeners: EventListener[] = [
        { event: "messageCreate", run: async (_, message) => this.createEvent(message) },
        { event: "messageUpdate", run: async (_, old, message) => this.updateEvent(old, message) },
        { event: "messageDelete", run: async (_, message) => await this.deleteEvent(message) },
        { event: "ready", run: async client => this.onReady(client) },
    ];
    public tasks: Task[] = [
        {
            name: `${this.moduleName}#postMessageTask`,
            timeout: 60000,
            run: client => this.reminderLoop(client),
        },
    ];

    constructor(
        private eventManagerService: EventManagerService,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService);

        console.log(this.commands[0].build().toJSON());
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

    private listEvents(interaction: ChatInputCommandInteraction): Promise<void> {
        return this.eventManagerService.listEvents(interaction);
    }

    private onReady(client: Client): Promise<void> {
        return this.eventManagerService.onReady(client);
    }
}
