import { Client, Message, ChatInputCommandInteraction, ApplicationCommandOptionType, PartialMessage, InteractionResponse } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Commands, Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { EventListeners, EventListener } from "../utils/objects/eventListener.js";
import { Timers } from "../utils/objects/timer.js";
import { addPermissionKeys } from "../utils/decorators/addPermissionKeys.js";
import { authorize } from "../utils/decorators/authorize.js";

/**
 * Module designed to deal with events. (Not Discord event)
 * @see EventManagerService
 */
@registerModule()
export class EventManagerModule extends ModuleBase {
  @addPermissionKeys()
  public static permissionKeys = {
    create: "EventManager.create",
    update: "EventManager.update",
    cancel: "EventManager.cancel",
    test: "EventManager.test",
    list: "EventManager.list"
  };

  public moduleName = "EventManager";
  public commands: Commands = [
    new Command({
      name: "event_manager",
      description: "Manages all things related to event planning.",
      subcommands: {
        CreateEvent: new Command({
          name: "create",
          description: "Creates a new event. Note no message will be posted only the data saved.",
          options: [
            new CommandOption({
              name: "text",
              description: "The new message you want to use instead. (Will not update the exiting message)",
              type: ApplicationCommandOptionType.String
            }),
            new CommandOption({
              name: "name",
              description: "Name of event.",
              type: ApplicationCommandOptionType.String
            }),
            new CommandOption({
              name: "description",
              description: "Description of event.",
              type: ApplicationCommandOptionType.String
            }),
            new CommandOption({
              name: "time",
              description: "Time of event.",
              type: ApplicationCommandOptionType.String
            })
          ]
        }),
        UpdateEvent: new Command({
          name: "update",
          description: "Updates event information with new one.",
          options: [
            new CommandOption({
              name: "index",
              description: "The index for the event, starting at 0.",
              type: ApplicationCommandOptionType.Integer,
              required: true
            }),
            new CommandOption({
              name: "text",
              description: "The new message you want to use instead. (Will not update the exiting message)",
              type: ApplicationCommandOptionType.String
            }),
            new CommandOption({
              name: "name",
              description: "Name of event.",
              type: ApplicationCommandOptionType.String
            }),
            new CommandOption({
              name: "description",
              description: "Description of event.",
              type: ApplicationCommandOptionType.String
            }),
            new CommandOption({
              name: "time",
              description: "Time of event.",
              type: ApplicationCommandOptionType.String
            })
          ]
        }),
        CancelEvent: new Command({
          name: "cancel",
          description: "Cancels an event. This is will effectively stop it.",
          options: [
            new CommandOption({
              name: "index",
              description: "The index for the event, starting at 0.",
              type: ApplicationCommandOptionType.Integer,
              required: true
            })
          ]
        }),
        TestEvent: new Command({
          name: "test",
          description: "Tests a given string with the event parser. Checking if it's valid and returning event details.",
          options: [
            new CommandOption({
              name: "text",
              description: "The message you wish to check against.",
              type: ApplicationCommandOptionType.String,
              required: true
            })
          ]
        }),
        ListEvent: new Command({
          name: "list",
          description: "Displays events.",
          options: [
            new CommandOption({
              name: "index",
              description: "The index for the event, starting at 0.",
              type: ApplicationCommandOptionType.Integer
            })
          ]
        })
      },
      execute: this.commandResolver.bind(this)
    })
  ];
  public eventListeners: EventListeners = [
    new EventListener("messageCreate", (_, [ message ]) => this.createEvent(message)),
    new EventListener("messageUpdate", (_, [ old, message ]) => this.updateEvent(old, message)),
    new EventListener("messageDelete", (_, [ message ]) => this.deleteEvent(message)),
    new EventListener("ready", (client) => this.onReady(client))
  ];
  public timers: Timers = [
    {
      name: `${this.moduleName}#postMessageTask`,
      timeout: 60000,
      execute: (client) => this.reminderLoop(client)
    }
  ];
  protected commandResolverKeys = {
    "event_manager.create": this.createEventCommand.bind(this),
    "event_manager.update": this.updateEventCommand.bind(this),
    "event_manager.cancel": this.cancelEventCommand.bind(this),
    "event_manager.test": this.testEventCommand.bind(this),
    "event_manager.list": this.listEventCommand.bind(this)
  };

  constructor(
    private service: EventManagerService,
    permissionManagerService: PermissionManagerService,
    @createLogger(EventManagerModule.name) logger: pino.Logger
  ) {
    super(permissionManagerService, logger);
  }

  // region Commands

  @authorize(EventManagerModule.permissionKeys.create)
  private createEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return this.service.createEventCommand(interaction);
  }

  @authorize(EventManagerModule.permissionKeys.update)
  private updateEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return this.service.updateEventCommand(interaction);
  }

  @authorize(EventManagerModule.permissionKeys.cancel)
  private cancelEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return this.service.cancelEventCommand(interaction);
  }

  @authorize(EventManagerModule.permissionKeys.test)
  private testEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return this.service.testEventCommand(interaction);
  }

  @authorize(EventManagerModule.permissionKeys.list)
  private listEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return this.service.listEventCommand(interaction);
  }

  // endregion
  // region Events

  private createEvent(message: Message): Promise<void> {
    return this.service.createEvent(message);
  }

  private updateEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
    return this.service.updateEvent(oldMessage, newMessage);
  }

  private deleteEvent(message: Message | PartialMessage): Promise<void> {
    return this.service.deleteEvent(message);
  }

  private onReady(client: Client): Promise<void> {
    return this.service.onReady(client);
  }

  // endregion

  private reminderLoop(client: Client): Promise<void> {
    return this.service.reminderLoop(client);
  }
}
