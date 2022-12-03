import { Client, Message, ChatInputCommandInteraction, ApplicationCommandOptionType, PartialMessage, InteractionResponse, EmbedBuilder } from "discord.js";
import { Module } from "../utils/objects/index.js";
import { EventManagerService } from "../services/eventManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Commands, Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../services/loggerService.js";
import { pino } from "pino";
import { EventListeners, EventListener } from "../utils/objects/eventListener.js";
import { Timers } from "../utils/objects/timer.js";
import { EventObj } from "../entities/event_manager/index.js";
import { WrongChannelError } from "../utils/errors/index.js";
import { DateTime } from "luxon";
import { module, addPermissionKeys, authorize, deferReply } from "../utils/decorators/index.js";

/**
 * Module designed to deal with events. (Not Discord event)
 * @see EventManagerService
 */
@module()
export class EventManagerModule extends Module {
  @addPermissionKeys()
  public static permissionKeys = {
    create: "EventManager.create",
    update: "EventManager.update",
    cancel: "EventManager.cancel",
    test: "EventManager.test",
    list: "EventManager.list",
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
              type: ApplicationCommandOptionType.String,
            }),
            new CommandOption({
              name: "name",
              description: "Name of event.",
              type: ApplicationCommandOptionType.String,
            }),
            new CommandOption({
              name: "description",
              description: "Description of event.",
              type: ApplicationCommandOptionType.String,
            }),
            new CommandOption({
              name: "time",
              description: "Time of event.",
              type: ApplicationCommandOptionType.String,
            }),
          ],
        }),
        UpdateEvent: new Command({
          name: "update",
          description: "Updates event information with new one.",
          options: [
            new CommandOption({
              name: "index",
              description: "The index for the event, starting at 0.",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            }),
            new CommandOption({
              name: "text",
              description: "The new message you want to use instead. (Will not update the exiting message)",
              type: ApplicationCommandOptionType.String,
            }),
            new CommandOption({
              name: "name",
              description: "Name of event.",
              type: ApplicationCommandOptionType.String,
            }),
            new CommandOption({
              name: "description",
              description: "Description of event.",
              type: ApplicationCommandOptionType.String,
            }),
            new CommandOption({
              name: "time",
              description: "Time of event.",
              type: ApplicationCommandOptionType.String,
            }),
          ],
        }),
        CancelEvent: new Command({
          name: "cancel",
          description: "Cancels an event. This is will effectively stop it.",
          options: [
            new CommandOption({
              name: "index",
              description: "The index for the event, starting at 0.",
              type: ApplicationCommandOptionType.Integer,
              required: true,
            }),
          ],
        }),
        TestEvent: new Command({
          name: "test",
          description:
            "Tests a given string with the event parser. Checking if it's valid and returning event details.",
          options: [
            new CommandOption({
              name: "text",
              description: "The message you wish to check against.",
              type: ApplicationCommandOptionType.String,
              required: true,
            }),
          ],
        }),
        ListEvent: new Command({
          name: "list",
          description: "Displays events.",
          options: [
            new CommandOption({
              name: "index",
              description: "The index for the event, starting at 0.",
              type: ApplicationCommandOptionType.Integer,
            }),
          ],
        }),
      },
      execute: this.commandResolver.bind(this),
    }),
  ];
  public eventListeners: EventListeners = [
    new EventListener("messageCreate", (_, [ message ]) => this.createEvent(message)),
    new EventListener("messageUpdate", (_, [ old, message ]) => this.updateEvent(old, message)),
    new EventListener("messageDelete", (_, [ message ]) => this.deleteEvent(message)),
    new EventListener("ready", client => this.onReady(client)),
  ];
  public timers: Timers = [
    {
      name: `${this.moduleName}#postMessageTask`,
      timeout: 60000,
      execute: client => this.reminderLoop(client),
    },
  ];
  protected commandResolverKeys = {
    "event_manager.create": this.createEventCommand.bind(this),
    "event_manager.update": this.updateEventCommand.bind(this),
    "event_manager.cancel": this.cancelEventCommand.bind(this),
    "event_manager.test": this.testEventCommand.bind(this),
    "event_manager.list": this.listEventCommand.bind(this),
  };

  constructor(
    private service: EventManagerService,
    permissionManagerService: PermissionManagerService,
    @createLogger(EventManagerModule.name) logger: pino.Logger,
  ) {
    super(permissionManagerService, logger);
  }

  // region Commands

  /**
   * Creates an event using the slash commands.
   * @param interaction The Discord interaction.
   * @private
   */
  @authorize(EventManagerModule.permissionKeys.create)
  @deferReply(true)
  private async createEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    const name = interaction.options.getString("name");
    const description = interaction.options.getString("description");
    const time = interaction.options.getString("time");

    const text = interaction.options.getString("text") ??
      (await this.service.createContent(interaction.guildId, name, description, time));

    const event = await this.service.create(interaction.guildId, null, text);
    await interaction.editReply({ content: event ? "Event was successfully created." : "Event failed to be created." });
  }

  /**
   * Updates existing events with slash commands.
   * Does not update the original message if it exists.
   * @param interaction The Discord interaction.
   * @private
   */
  @authorize(EventManagerModule.permissionKeys.update)
  @deferReply(true)
  private async updateEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    const index = interaction.options.getNumber("index", true);
    const name = interaction.options.getString("name");
    const description = interaction.options.getString("description");
    const time = interaction.options.getString("time");

    const event = await this.service.updateByIndex(
      interaction.guildId,
      index,
      await this.service.createContent(interaction.guildId, name, description, time),
    );
    await interaction.editReply({ content: event ? "Event was successfully updated." : "Event failed to be updated." });
  }

  /**
   * Cancels an event with slash commands.
   * @param interaction The Discord interaction.
   * @private
   */
  @authorize(EventManagerModule.permissionKeys.cancel)
  @deferReply(true)
  private async cancelEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    const index = interaction.options.getNumber("index", true);

    try {
      await this.service.cancelByIndex(interaction.guildId, index);
      await interaction.editReply({ content: "Event was successfully canceled." });
    } catch (error) {
      this.logger.error(error instanceof Error ? error.stack : error);
      await interaction.editReply({ content: "Event failed to be canceled." });
    }
  }

  /**
   * Tests the string to see if it is a valid event and returns the result.
   * @param interaction The Discord interaction.
   * @private
   */
  @authorize(EventManagerModule.permissionKeys.test)
  @deferReply()
  private async testEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    const event = await this.service.parseEvent(interaction.guildId, interaction.options.getString("text", true));
    await interaction.editReply({
      embeds: [
        new EmbedBuilder({
          title: event.isValid ? "Event is valid." : "Event is not valid.",
          fields: [
            { name: "Name", value: event.name ?? "Name cannot be null." },
            { name: "Description", value: event.description ?? "Description cannot be null." },
            {
              name: "Time",
              value: event.dateTime
                ? event.dateTime < DateTime.now().toUnixInteger()
                  ? `<t:${event.dateTime}:F>`
                  : "Time is before the present."
                : "The format for the time was not correct. Use the Hammer time syntax to help.",
            },
            { name: "Additional", value: event.additional.map(pair => `[${pair[0]}]\n${pair[1]}`).join("\n") },
          ],
        }).setColor(event.isValid ? "Green" : "Red"),
      ],
    });
  }

  /**
   * Lists all events currently registered or returns the details of just one event if index is provided.
   * @param interaction The Discord interaction.
   * @private
   */
  @authorize(EventManagerModule.permissionKeys.list)
  @deferReply()
  private async listEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    const event = await this.service.findIndex(interaction.guildId, interaction.options.getInteger("index"));

    if (event == null) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder({
            title: "No events were set.",
            description: "There are currently no active events going on in your guild.",
          }),
        ],
      });
      return;
    }

    const embed: EmbedBuilder =
      event instanceof EventObj
        ? this.service.createEventEmbed(event)
        : new EmbedBuilder({
          title: "Upcoming Events",
          fields: event.map((event, index) => ({
            name: `Index ${index}:`,
            value: `${event.name}\n**Begins: <t:${event.dateTime}:R>**`,
            inline: false,
          })),
        }).setColor("Random");

    await interaction.editReply({ embeds: [ embed ] });
  }

  // endregion
  // region Events

  /**
   * Event fired when a message is created.
   * Will attempt to create an event from the message and react.
   * @param message The message or partial message to be parsed.
   * @private
   */
  private async createEvent(message: Message | PartialMessage): Promise<void> {
    this.logger.debug("On Message Create fired. Creating new event.");

    if (message.partial) message = await message.fetch();
    if (message.author?.id === message.client?.application?.id || message.applicationId) {
      this.logger.debug("Author is an application and message is ignored.");
      return;
    }

    try {
      const event: EventObj = await this.service.create(
        message.guildId,
        message.id,
        message.content,
        message.channelId,
      );
      await message.react(event ? "✅" : "❎");
      this.logger.debug("New event created.");
    } catch (error) {
      if (error instanceof WrongChannelError) {
        this.logger.debug("Channel was wrong.");
        return;
      }

      this.logger.error(error instanceof Error ? error.stack : error);
      await message.react("❓");
    }
  }

  /**
   * Event fired when a message is updated.
   * Will attempt to update an existing event with the new data and fire.
   * @param oldMessage The message or partial old message.
   * @param newMessage The message or partial new message to be parsed.
   * @private
   */
  private async updateEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
    if (oldMessage.partial) await oldMessage.fetch();
    if (newMessage.partial) await newMessage.fetch();
    if (newMessage.author?.id === newMessage.client?.application?.id || newMessage.applicationId) {
      this.logger.debug("Author is an application and message is ignored.");
      return;
    }

    if (!(await this.service.eventExists(oldMessage.guildId, oldMessage.id))) {
      return;
    }

    try {
      const event = await this.service.update(oldMessage.guildId, oldMessage.id, newMessage.content);

      const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
      if (reaction) await reaction.users.remove(oldMessage.client.user?.id);

      await newMessage.react(event ? "✅" : "❎");
    } catch (error) {
      this.logger.error(error instanceof Error ? error.stack : error);
      await newMessage.react("❓");
    }
  }

  /**
   * Event fired when a message is deleted.
   * Will attempt to cancel an existing event with the new data and fire.
   * @param message
   * @private
   */
  private async deleteEvent(message: Message | PartialMessage): Promise<void> {
    if (message.partial) message = await message.fetch();

    return this.service.cancel(message.guildId, message.id);
  }

  /**
   * On ready event.
   * @param client The Bot client.
   * @private
   */
  private onReady(client: Client): Promise<void> {
    return this.service.onReady(client);
  }

  // endregion

  /**
   * Timer loop fired for when an event reminder needs to be called.
   * @param client
   * @private
   */
  private reminderLoop(client: Client): Promise<void> {
    return this.service.reminderLoop(client);
  }
}
