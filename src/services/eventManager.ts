import { Client, EmbedBuilder, Channel, ChannelType } from "discord.js";
import { DateTime } from "luxon";

import { Timer } from "../utils/objects/timer.js";
import { fetchMessages } from "../utils/index.js";
import { Service } from "./service.js";
import { service } from "../utils/decorators/index.js";
import { WrongChannelError } from "../utils/errors/index.js";
import { EventManagerSettingsRepository } from "../repositories/eventManager/eventManagerSettingsRepository.js";
import { EventManagerSettings, EventObject } from "../entities/eventManager/index.js";
import { EventObjectRepository } from "../repositories/eventManager/eventObjectRepository.js";
import { EventReminderRepository } from "../repositories/eventManager/eventReminderRepository.js";
import { LessThanOrEqual } from "typeorm";
import { Logger } from "../utils/logger.js";

/**
 * Event manager service.
 * Handles all things related to real life event, not Discord events.
 */
@service()
export class EventManagerService extends Service {
  private logger: Logger = new Logger(EventManagerService);

  private readonly eventManagerSettingsRepository: EventManagerSettingsRepository;
  private readonly eventObjectRepository: EventObjectRepository;
  private readonly eventReminderRepository: EventReminderRepository;

  constructor(
    eventManagerSettingsRepository: EventManagerSettingsRepository,
    eventObjectRepository: EventObjectRepository,
    eventReminderRepository: EventReminderRepository,
  ) {
    super();

    this.eventManagerSettingsRepository = eventManagerSettingsRepository;
    this.eventObjectRepository = eventObjectRepository;
    this.eventReminderRepository = eventReminderRepository;
  }

  private async getConfig(guildId: string): Promise<EventManagerSettings> {
    const config: EventManagerSettings = await this.eventManagerSettingsRepository.findOne({ where: { guildId: guildId } });

    if (config) {
      return config;
    }

    return await this.eventManagerSettingsRepository.save(new EventManagerSettings(guildId));
  }

  /**
   * Parses the string into an EventObj.
   * No event will be created.
   * @param guildId Guild ID to get the configuration from.
   * @param text The text to test against.
   */
  public async parseEvent(guildId: string | null, text: string): Promise<EventObject> {
    const config = await this.getConfig(guildId);
    return this.parseMessage(null, text, config);
  }

  /**
   * Returns a list of events. Or just one if an index was provided. Null if there are no events.
   * @param guildId Guild ID to get the configuration from.
   * @param index An index number to pick a specific event.
   */
  public async findByIndex(guildId: string | null, index?: number): Promise<EventObject | EventObject[] | null> {
    const events: EventObject[] = await this.eventObjectRepository.getEventsByGuildId(guildId);

    if (events.length < 1) {
      return null;
    }

    return index == null ? events : events[index % events.length];
  }

  /**
   * Creates the content string for a valid event based on the config of a guild.
   * @param guildId Guild ID to get the configuration file.
   * @param name Name of the event.
   * @param description Description of the event.
   * @param time Time fo the event.
   * @param additional Additional tags for the event.
   */
  public async createContent(
    guildId: string | null,
    name: string,
    description: string,
    time: string,
    additional: [ string, string ][] = [],
  ): Promise<string> {
    const config = await this.getConfig(guildId);
    const [ l, r ] = config.delimiterCharacters;

    let result = l + config.announcement + r + name + "\n";
    result += `${l}${config.description}${r}\n${description}\n`;
    result += `${l}${config.dateTime}${r}\n${time}\n`;

    for (const [ k, v ] of additional) {
      result += `${l}${k}${r}\n${v}\n`;
    }

    return result;
  }

  /**
   * Attempt to create an event and returns it.
   * Will return null if it was unable to do so.
   * @param guildId Guild ID to get the configuration from.
   * @param id ID of the event.
   * @param content Text content of the message.
   * @param channelId ID of the channel the message was posted in. Used for additional validation.
   */
  public async create(
    guildId: string | null,
    id: string,
    content: string,
    channelId?: string,
  ): Promise<EventObject | null> {
    const config = await this.getConfig(guildId);

    if (channelId && config.listenerChannelId !== channelId) {
      throw new WrongChannelError("Listening channel is not the same as the provided channel ID.");
    }

    const event = this.parseMessage(id, content, config);
    if (!event.isValid) {
      return null;
    }

    event.guildId = guildId;
    await this.eventObjectRepository.save(event);
    return event;
  }

  /**
   * Attempts to information with an event with the new text of the message.
   * @param guildId Guild ID to ge the configuration from.
   * @param messageId ID of the message.
   * @param content Text content of the message.
   */
  public async update(guildId: string | null, messageId: string, content: string): Promise<EventObject | null> {
    const config = await this.getConfig(guildId);

    const oldEvent = await this.eventObjectRepository.findOne({ where: { guildId, id: messageId } });
    if (!oldEvent) {
      throw new Error("Event does not exist.");
    }

    const event = this.parseMessage(messageId, content, config);
    if (!event.isValid) {
      return null;
    }

    return this.eventObjectRepository.save(event);
  }

  /**
   * Attempts to information with an event with the new text of the message by the index rather than the ID.
   * @param guildId Guild ID to ge the configuration from.
   * @param index Index of the event.
   * @param content Text content of the message.
   */
  public async updateByIndex(guildId: string | null, index: number, content: string): Promise<EventObject | null> {
    const config = await this.getConfig(guildId);

    const oldEvent = await this.findByIndex(guildId, index) as EventObject;

    const event = this.parseMessage(oldEvent.messageId, content, config);
    if (!event.isValid) {
      return null;
    }

    return this.eventObjectRepository.save(event);
  }

  /**
   * Attempts to cancel an event if it exists.
   * @param guildId Guild ID to ge the configuration from.
   * @param messageId ID of the event.
   */
  public async cancel(guildId: string | null, messageId: string): Promise<void> {
    const index = await this.eventObjectRepository.findOne({ where: { guildId, messageId: messageId } });
    if (!index) return;

    await this.eventObjectRepository.delete({ id: index.id });
  }

  /**
   * Attempts to cancel an event if it exists.
   * @param guildId Guild ID to ge the configuration from.
   * @param index Index of the event.
   */
  public async cancelByIndex(guildId: string | null, index: number): Promise<void> {
    const event = await this.findByIndex(guildId, index) as EventObject;
    await this.eventObjectRepository.delete({ id: event.id });
  }

  /**
   * Returns if the event exists or not.
   * @param guildId Guild ID to get the configuration from.
   * @param messageId ID of the event.
   */
  public async eventExists(guildId: string | null, messageId: string): Promise<boolean> {
    return await this.eventObjectRepository.findOne({ where: { guildId, messageId } }) != null;
  }

  /**
   * Fetches all event messages to ensure they are loaded for Discord events to fire.
   * @param client The client.
   */
  public async onReady(client: Client): Promise<void> {
    const promises: Promise<unknown>[] = [];
    const settings: EventManagerSettings[] = await this.eventManagerSettingsRepository.getAll();

    for (const setting of settings) {
      const events = await this.eventObjectRepository.getEventsByGuildId(setting.guildId);
      if (!setting.listenerChannelId || events.length < 1) continue;

      const messageIds: string[] = [];
      for (const event of events) {
        if (!event.messageId) {
          messageIds.push(event.messageId);
        }
      }

      promises.push(fetchMessages(client, setting.listenerChannelId, messageIds));
    }

    await Promise.all(promises);
  }

  /**
   * The main loop used to post reminders about events.
   * @param client The client.
   */
  public async reminderLoop(client: Client): Promise<void> {
    await Timer.waitTillReady(client);

    const now: DateTime = DateTime.now();

    for (const setting of await this.eventManagerSettingsRepository.getAll()) {
      try {
        const postingChannel: Channel | null = await client.channels.fetch(setting.postingChannelId);

        if (!(postingChannel.type === ChannelType.GuildText && postingChannel.guildId === setting.guildId)) {
          this.logger.warn("Either posting channel does not exist or it is not inside of guild. Skipping...");
          continue;
        }

        for (const reminder of await this.eventReminderRepository.findAll({ where: { guildId: setting.guildId } })) {
          const reminderTimeDelta = reminder.asDuration;
          for (const event of await this.eventObjectRepository.getEventsByGuildId(setting.guildId)) {
            const eventTime = DateTime.fromSeconds(event.dateTime);
            if (eventTime.diff(now, [ "days" ]).days > 1) continue;

            const difference = eventTime.minus(reminderTimeDelta);
            if (difference.hour === now.hour && difference.minute === now.minute) {
              const messageValues: { [key: string]: string } = {
                "%everyone%": "@everyone",
                "%eventName%": event.name,
                "%hourDiff%": reminderTimeDelta.hours.toString(),
                "%minuteDiff%": reminderTimeDelta.minutes.toString(),
              };

              await postingChannel.send(reminder.message.replace(/%\w+%/g, v => messageValues[v] || v));
            }
          }
        }

        await this.eventObjectRepository.delete({ dateTime: LessThanOrEqual(now.toUnixInteger()) });
      } catch (error) {
        this.logger.error(error instanceof Error ? error.stack : error);
      }
    }
  }

  /**
   * Creates a Discord Embed based on an Event Object.
   * @param event The event object.
   * @private
   */
  public createEventEmbed(event: EventObject): EmbedBuilder {
    return new EmbedBuilder({
      title: event.name,
      description: event.description,
      fields: [
        { name: "Time", value: `Set for: <t:${event.dateTime}:F>\nTime Left: <t:${event.dateTime}:R>` },
        ...event.additional.map(pair => ({ name: pair[0], value: pair[1], inline: true })),
      ],
    }).setColor("Random");
  }

  /**
   * Returns a string with all regex characters escaped.
   * @param text
   * @private
   */
  private regexpEscape(text: string): string {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  /**
   * Attempts to parse a string into a EventObject.
   * @param messageId The event ID.
   * @param content The content of the message. As in its text.
   * @param config Tags to parse with
   * @private
   */
  private parseMessage(
    messageId: string,
    content: string,
    config: EventManagerSettings,
  ): EventObject {
    const [ l, r ] = config.delimiterCharacters.map(c => this.regexpEscape(c));
    const event = new EventObject();
    event.messageId = messageId;
    const regExp = new RegExp(`${l}(.*?)${r}([^${l}]*)`, "g");

    for (const [ , k, v ] of content.matchAll(regExp)) {
      if (!k || !v) continue;
      const key = k.trim(),
        value = v.trim();

      let date: DateTime, time: number;
      switch (key) {
        case config.announcement:
          event.name = value;
          break;

        case config.description:
          event.description = value;
          break;

        case config.dateTime:
          if (config.dateTimeFormat.length > 0) {
            let flag = false;
            for (const format of config.dateTimeFormat) {
              date = DateTime.fromFormat(value, format);
              if (date.isValid) {
                event.dateTime = date.toUnixInteger();
                flag = true;
                break;
              }
            }
            if (flag) break;
          }

          // Checks if it's hammer time.
          time = Number(value.match(/<.:(\d+):.>/)?.[1] ?? undefined);
          if (!time || isNaN(time)) break;

          date = DateTime.fromSeconds(time);
          if (!date.isValid) break;
          event.dateTime = date.toUnixInteger();
          break;

        default:
          if (!config.exclusionList.every(e => e !== key)) continue;
          event.additional.push([ key, value ]);
          break;
      }
    }

    return event;
  }
}
