import { Client, Message, TextChannel, ChatInputCommandInteraction, EmbedBuilder, PartialMessage, InteractionResponse } from "discord.js";
import { DateTime, Duration } from "luxon";
import { singleton } from "tsyringe";

import { Timer } from "../utils/objects/timer.js";
import { fetchMessages } from "../utils/index.js";
import { EventManagerRepository } from "../repositories/eventManager.repository.js";
import { EventManagerConfig, EventObj } from "../models/event_manager/index.js";
import { Service } from "../utils/objects/service.js";

@singleton()
export class EventManagerService extends Service<EventManagerConfig> {
  constructor(repository: EventManagerRepository) {
    super(repository);
  }

  protected static parseTriggerDuration(triggerTime: string): Duration {
    const hold = DateTime.fromFormat(triggerTime, "HH:mm");
    return Duration.fromObject({
      hours: hold.get("hour"),
      minutes: hold.get("minute")
    });
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
  public testEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    return interaction.reply("Yellow");
  }

  /**
   * Todo: Cleanup
   * Responds with an embed saying information about a specific event or lists a brief description of all events.
   * @param interaction The Discord Interaction.
   */
  public async listEventCommand(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
    const config = await this.getConfig(interaction.guildId);

    const embed: EmbedBuilder = new EmbedBuilder().setColor("Random");

    if (config.events.length <= 0) {
      embed.addFields({
        name: "Notice",
        value: "There are no upcoming events!"
      });
      await interaction.reply({ embeds: [ embed ] });
      return;
    }

    const index = interaction.options.getInteger("index");
    if (index !== null) {
      const event: EventObj = config.events[index % config.events.length];
      embed.setTitle(event.name);
      embed.setDescription(event.description);

      for (const [ key, value ] of event.additional) {
        embed.addFields({ name: key, value, inline: false });
      }

      embed.addFields(
        {
          name: "Time Remaining:",
          value: `<t:${event.dateTime}:R>`,
          inline: false
        },
        { name: "Set For:", value: `<t:${event.dateTime}:f>`, inline: false }
      );
    } else {
      embed.setTitle("Upcoming Events");

      for (const [ index, event ] of config.events.entries()) {
        embed.addFields({
          name: `Index ${index}:`,
          value: `${event.name}\n**Begins: <t:${event.dateTime}:R>**`,
          inline: false
        });
      }
    }
    await interaction.reply({ embeds: [ embed ] });
  }

  //endregion
  // region Events

  /**
   * Todo: Cleanup
   * Attempts to create a new event object from a message.
   * Will react to the message if it completed successfully or not.
   * @param message The Discord message object to create a new event from.
   */
  public async createEvent(message: Message): Promise<void> {
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
      if (EventObj.isValid(event) && event.dateTime > DateTime.now().toUnixInteger()) {
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

      if (EventObj.isValid(newEvent)) {
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
   * Todo: Cleanup
   * The main loop used to post reminders about events.
   * @param client The client.
   */
  public async reminderLoop(client: Client): Promise<void> {
    await Timer.waitTillReady(client);

    const now: DateTime = DateTime.now();
    const configs = (await this.repository.getAll()).filter(
      (config) => config.postingChannelId && config.events.length > 0 && client.guilds.cache.has(config.guildId)
    );
    const alteredConfigs: EventManagerConfig[] = [];

    for (const config of configs) {
      try {
        if (client.channels.cache.has(config.postingChannelId)) {
          const postingChannel: TextChannel | null = (await client.channels.fetch(
            config.postingChannelId
          )) as TextChannel | null;
          if (postingChannel && postingChannel.guildId === config.guildId) {
            for (const trigger of config.reminders.filter((trigger) => trigger.timeDelta)) {
              const triggerTime = EventManagerService.parseTriggerDuration(trigger.timeDelta);
              for (const event of config.events) {
                const eventTime = DateTime.fromSeconds(event.dateTime);
                if (eventTime.diff(now, [ "days" ]).days > 1) continue;

                const difference = eventTime.minus(triggerTime);
                if (difference.hour === now.hour && difference.minute === now.minute) {
                  const messageValues: { [key: string]: string } = {
                    "%everyone%": "@everyone",
                    "%eventName%": event.name,
                    "%hourDiff%": triggerTime.get("hours").toString(),
                    "%minuteDiff%": triggerTime.get("minutes").toString()
                  };

                  await postingChannel.send(trigger.message.replace(/%\w+%/g, (v) => messageValues[v] || v));
                }
              }
            }
          }
        }

        const before = config.events.length;

        config.events.forEach((event, index, array) => {
          if (event.dateTime <= now.toUnixInteger()) {
            array.splice(index, 1);
          }
        });

        if (before !== config.events.length) {
          alteredConfigs.push(config);
        }
      } catch (err: Error | unknown) {
        console.error(err);
      }
    }

    if (alteredConfigs.length > 0) {
      await this.repository.bulkSave(alteredConfigs);
    }
  }

  /**
   * Todo: Cleanup
   * Attempts to parse a string into a EventObject.
   * @param messageId The message ID.
   * @param content The content of the message. As in its text.
   * @param config The config to parse the message against.
   * @private
   */
  private parseMessage(messageId: string, content: string, config: EventManagerConfig): EventObj {
    const event = new EventObj(messageId);
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
}
