import { Client, Message, ChatInputCommandInteraction, EmbedBuilder, PartialMessage, InteractionResponse, Channel, ChannelType } from "discord.js";
import { DateTime } from "luxon";
import { singleton } from "tsyringe";

import { Timer } from "../utils/objects/timer.js";
import { fetchMessages } from "../utils/index.js";
import { EventManagerRepository } from "../repositories/eventManager.repository.js";
import { EventManagerConfig, EventObj } from "../models/event_manager/index.js";
import { Service } from "../utils/objects/service.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";

@singleton()
export class EventManagerService extends Service<EventManagerConfig> {
  constructor(
    repository: EventManagerRepository,
    @createLogger(EventManagerService.name) private logger: pino.Logger
  ) {
    super(repository);
  }

  // region Command

  /**
   * Attempts to create a new event.
   * No message will be posted to any channel.
   * @param interaction The Discord Interaction.
   */
  public createEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return interaction.reply("Yellow");
  }

  /**
   * Attempts to update an existing event with new data.
   * @param interaction The Discord Interaction.
   */
  public updateEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return interaction.reply("Yellow");
  }

  /**
   * Attempts to cancel an event.
   * @param interaction The Discord Interaction.
   */
  public cancelEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return interaction.reply("Yellow");
  }

  /**
   * Tests the event message and returns additional information.
   * No event will be created.
   * @param interaction The Discord Interaction.
   */
  public async testEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    const config = await this.getConfig(interaction.guildId);

    const text = interaction.options.getString("text", true);
    const event = this.parseMessage(null, text, config);

    return interaction.reply({
      embeds: [
        new EmbedBuilder({
          title: event.isValid ? "Event is valid." : "Event is not valid.",
          fields: [
            { name: "Name", value: event.name ?? "Name cannot be null." },
            { name: "Description", value: event.description ?? "Description cannot be null." },
            {
              name: "Time",
              value: event.dateTime ?
                `<t:${event.dateTime}:F>` :
                "The format for the time was not correct. Use the Hammer time syntax to help."
            },
            { name: "Additional", value: event.additional.map(pair => `[${pair[0]}]\n${pair[1]}`).join("\n") }
          ]
        }).setColor(event.isValid ? "Green" : "Red")
      ]
    });
  }

  /**
   * Responds with an embed saying information about a specific event or lists a brief description of all events.
   * @param interaction The Discord Interaction.
   */
  public async listEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    const config = await this.getConfig(interaction.guildId);

    if (config.events.length < 1) {
      return interaction.reply({
        embeds: [ new EmbedBuilder({
          title: "No events were set.",
          description: "There are currently no active events going on in your guild."
        }) ]
      });
    }

    const index = interaction.options.getInteger("index");
    const embed: EmbedBuilder = index ?
      this.createEventEmbed(config.getEventByIndex(index)) :
      new EmbedBuilder({
        title: "Upcoming Events",
        fields: config.events.map((event, index) => ({
          name: `Index ${index}:`,
          value: `${event.name}\n**Begins: <t:${event.dateTime}:R>**`,
          inline: false
        }))
      }).setColor("Random");

    return interaction.reply({ embeds: [ embed ] });
  }

  //endregion
  // region Events

  /**
   * Todo: Cleanup
   * Attempts to create a new event object from a message.
   * Will react to the message if it completed successfully or not.
   * @param message The Discord message object to create a new event from.
   */
  public async createEvent(message: Message | PartialMessage): Promise<void> {
    if (message.partial) {
      await message.fetch();
    }

    if (message.author.id === message.client.application?.id) return;
    if (!message.guildId) return;
    const config = await this.getConfig(message.guildId);

    if (config.listenerChannelId !== message.channelId) return;
    const [ l, r ]: string[] = config.delimiterCharacters as string[];

    const regex = new RegExp(`${l}(.*?)${r}`, "g");
    let flag = false;
    let match = regex.exec(message.content);

    while (match != null) {
      if (match[1].trim() === config.tags.announcement) {
        flag = true;
        break;
      }
      match = regex.exec(message.content);
    }

    if (!flag) {
      return;
    }

    const event: EventObj = this.parseMessage(message.id, message.content, config);
    try {
      if (event.isValid && event.dateTime > DateTime.now().toUnixInteger()) {
        config.events.push(event);
        await message.react("✅");
        await this.repository.save(config);
      } else {
        await message.react("❎");
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Todo: Cleanup
   * Attempts to synchronize the data from the event with the new text of the message.
   * @param oldMessage The older message.
   * @param newMessage The new message with new text.
   */
  public async updateEvent(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
    if (oldMessage.partial) await oldMessage.fetch();
    if (newMessage.partial) await newMessage.fetch();

    const config = await this.getConfig(oldMessage.guildId);

    if (config.listenerChannelId !== oldMessage.channelId) return;
    const oldEvent = config.events.find((event) => event.messageId === oldMessage.id);
    if (!oldEvent) return;

    const newEvent = this.parseMessage(oldMessage.id, newMessage.content, config);

    try {
      const reaction = newMessage.reactions.cache.find((reaction) => reaction.me);
      if (reaction) await reaction.users.remove(oldMessage.client.user?.id);

      if (newEvent.isValid) {
        await newMessage.react("✅");
        config.events[config.events.indexOf(oldEvent)] = newEvent;
        await this.repository.save(config);
      } else {
        await newMessage.react("❎");
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Todo: Cleanup
   * Attempts to delete an event if it exists.
   * @param message The message to reference the event from.
   */
  public async deleteEvent(message: Message | PartialMessage): Promise<void> {
    if (message.partial) await message.fetch();
    const config = await this.getConfig(message.guildId);

    if (!config.events.find((event) => event.messageId === message.id)) return;

    config.events.splice(
      config.events.findIndex((event) => event.messageId === message.id),
      1
    );
    await this.repository.save(config);
  }

  /**
   * Fetches all event messages to ensure they are loaded for Discord events to fire.
   * @param client The client.
   */
  public async onReady(client: Client): Promise<void> {
    const configs: EventManagerConfig[] = await this.repository.findAll({});

    for (const config of configs) {
      if (!config.listenerChannelId || !config.events.length) continue;
      await fetchMessages(client, config.listenerChannelId, config.events.map((event) => event.messageId));
    }
  }

  // endregion

  /**
   * The main loop used to post reminders about events.
   * @param client The client.
   */
  public async reminderLoop(client: Client): Promise<void> {
    await Timer.waitTillReady(client);

    const now: DateTime = DateTime.now();
    const alteredConfigs: EventManagerConfig[] = [];
    const configs = await this.repository.getAll()
      .then(configs => configs.filter((config) => config.postingChannelId && config.events.length > 0 && client.guilds.cache.has(config.guildId)));

    for (const config of configs) {
      try {
        const postingChannel: Channel | null = (await client.channels.fetch(config.postingChannelId));

        if (!(postingChannel.type === ChannelType.GuildText && postingChannel.guildId === config.guildId)) {
          this.logger.warn("Either posting channel does not exist or it is not inside of guild. Skipping...");
          continue;
        }

        for (const reminder of config.reminders.filter((trigger) => trigger.timeDelta)) {
          const reminderTimeDelta = reminder.asDuration;
          for (const event of config.events) {
            const eventTime = DateTime.fromSeconds(event.dateTime);
            if (eventTime.diff(now, [ "days" ]).days > 1) continue;

            const difference = eventTime.minus(reminderTimeDelta);
            if (difference.hour === now.hour && difference.minute === now.minute) {
              const messageValues: { [key: string]: string } = {
                "%everyone%": "@everyone",
                "%eventName%": event.name,
                "%hourDiff%": reminderTimeDelta.hours.toString(),
                "%minuteDiff%": reminderTimeDelta.minutes.toString()
              };

              await postingChannel.send(reminder.message.replace(/%\w+%/g, (v) => messageValues[v] || v));
            }
          }
        }

        let changeFlag = false;
        config.events.forEach((event, index, array) => {
          if (event.dateTime <= now.toUnixInteger()) {
            array.splice(index, 1);
            changeFlag = true;
          }
        });

        if (changeFlag) {
          alteredConfigs.push(config);
        }
      } catch (error) {
        this.logger.error(error instanceof Error ? error.stack : error);
      }
    }

    if (alteredConfigs.length > 0) {
      await this.repository.bulkSave(alteredConfigs);
    }
  }

  /**
   * Todo: Cleanup
   * Todo: Fix issue with additional loosing their formatting.
   * Attempts to parse a string into a EventObject.
   * @param messageId The message ID.
   * @param content The content of the message. As in its text.
   * @param config The config to parse the message against.
   * @private
   */
  private parseMessage(messageId: string, content: string, config: EventManagerConfig): EventObj {
    const event = new EventObj({ messageId });
    const hammerRegex = /<.*:(\d+):.*>/;
    const [ l, r ] = config.delimiterCharacters as [ string, string ];
    const re = new RegExp(`${l}(.*?)${r}([^${l}]*)`, "g");
    let match = re.exec(content);

    while (match != null) {
      const key = match[1]?.trim();
      const value = match[2]?.trim();

      let date: DateTime, matchedResult: RegExpMatchArray, unixTimeStr: string, number: number;
      switch (key) {
        case config.tags.announcement:
          event.name = value;
          break;

        case config.tags.description:
          event.description = value;
          break;

        case config.tags.dateTime:
          if (config.dateTimeFormat.length > 0) {
            date = DateTime.fromFormat(value, config.dateTimeFormat, {});
            if (date.isValid) {
              event.dateTime = date.toUnixInteger();
              break;
            }
          }

          // Checks if it's hammer time.
          matchedResult = value?.match(hammerRegex);

          if (!matchedResult) break;
          unixTimeStr = matchedResult[1];
          if (!unixTimeStr) break;
          number = Number(unixTimeStr);
          if (isNaN(number)) break;

          date = DateTime.fromSeconds(number);
          if (!date.isValid) break;
          event.dateTime = date.toUnixInteger();
          break;

        default:
          if (!config.tags.exclusionList.every((e) => e !== key)) continue;
          event.additional.push([ key, value ]);
          break;
      }

      match = re.exec(content);
    }

    return event;
  }

  /**
   * Creates a Discord Embed based on an Event Object.
   * @param event The event object.
   * @private
   */
  private createEventEmbed(event: EventObj): EmbedBuilder {
    return new EmbedBuilder({
      title: event.name,
      description: event.description,
      fields: [
        { name: "Time", value: `Set for: <t:${event.dateTime}:F>\nTime Left: <t:${event.dateTime}:R>` },
        ...event.additional.map(pair => ({ name: pair[0], value: pair[1], inline: true }))
      ]
    }).setColor("Random");
  }
}
