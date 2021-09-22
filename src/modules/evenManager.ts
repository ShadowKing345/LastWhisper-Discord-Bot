import { DefaultConfig, EventObj } from "../objects/eventManager";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
import { CommandInteraction, Message, MessageEmbed, PartialMessage, TextChannel } from "discord.js";
import Client from "../Client";

const moduleName = "eventManager";

dayjs.extend(CustomParseFormat);
dayjs.extend(AdvancedFormat);

function chunk(array: [], chunkSize: number) {
  var R = [];
  for (var i = 0; i < array.length; i += chunkSize)
    R.push(array.slice(i, i + chunkSize));
  return R;
}

function parseMessage(messageId: string, content: string, config: DefaultConfig): EventObj {
  const event = new EventObj(messageId);
  const hammerRegex: RegExp = /\:(.*?)\:/
  let re = new RegExp(config.delimiterPattern);

  const patternSplit: [] = content.split(re).filter(line => line.trim()).map(entry => entry.trim()) as [];
  const splittedContent: { [key: string]: string } = Object.fromEntries(chunk(patternSplit, 2));

  for (const [key, content] of Object.entries(splittedContent)) {
    switch (key) {
      case config.tags.announcement:
        event.name = content;
        break;
      case config.tags.description:
        event.description = content;
        break;
      case config.tags.dateTime:
        let date: dayjs.Dayjs = dayjs(content, config.dateTimeFormat, true);
        if (date.isValid()) {
          event.dateTime = date.format();
          break;
        }

        // Checks if it is a hammer time.
        const matchedResult = content.match(hammerRegex);

        if (!matchedResult) break;
        const unixTimeStr = matchedResult[1];
        if (!unixTimeStr) break;
        const number: number = Number(unixTimeStr);
        if (isNaN(number)) break;

        date = dayjs.unix(number);
        if (!date.isValid()) break;
        event.dateTime = date.format();

        break;
      default:
        if (key in config.tags.exclusionList) continue;
        event.additional[key] = content;
        break;
    }
  }

  return event;
}

function getConfig(client: Client, guildId: string): DefaultConfig {
  var config: DefaultConfig | null = client.configs.getConfig(moduleName, guildId) as DefaultConfig | null;
  if (!config) {
    config = new DefaultConfig();
    client.configs.setConfig(moduleName, guildId, config);
  }

  return config;
}

async function messageCreateListener(message: Message) {
  if (message.author.id === message.client.application?.id) return;
  if (!message.guildId) return;
  const config: DefaultConfig = getConfig(message.client as Client, message.guildId);

  if (!config.listenerChannelId || message.channelId !== config.listenerChannelId) return;

  const event: EventObj = parseMessage(message.id, message.content, config);
  try {
    if (event.isValid()) {
      config.events.push(event);
      await message.react("✅");
    } else {
      await message.react("❎");
    }
  } catch (error) { console.error(error); }
}

async function messageUpdateListener(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
  if (newMessage.author?.id === newMessage.client.application?.id) return;
  if (!oldMessage.guildId) return;
  const config: DefaultConfig = getConfig(oldMessage.client as Client, oldMessage.guildId);

  if (!config.listenerChannelId || oldMessage.channelId !== config.listenerChannelId) return;
  const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
  if (!oldEvent) return;

  const newEvent = parseMessage(newMessage.id, (newMessage as Message).content, config);

  try {
    const reaction = newMessage.reactions.cache.find(reaction => reaction.me);
    if (reaction)
      await reaction.users.remove(oldMessage.client.user?.id);

    if (newEvent.isValid()) {
      oldEvent.name = newEvent.name;
      oldEvent.description = newEvent.description;
      oldEvent.dateTime = newEvent.dateTime;
      oldEvent.additional = newEvent.additional;
      await newMessage.react("✅");
    } else {
      await newMessage.react("❎");
    }
  } catch (error) { console.error(error); }
}

async function messageDeleteListener(message: Message | PartialMessage) {
  if (message.author?.id === message.client.application?.id) return;
  if (!message.guildId) return;
  const config: DefaultConfig = getConfig(message.client as Client, message.guildId);

  if (!config.listenerChannelId || message.channelId !== config.listenerChannelId) return;
  if (!config.events.find(event => event.messageId === message.id)) return;

  config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
}

async function postEventRemindersLoop(client: Client) {
  const now: dayjs.Dayjs = dayjs();
  const configs: { [guildId: string]: DefaultConfig } = client.configs.getConfigs(moduleName);

  for (const [_, config] of Object.entries(configs)) {
    try {
      if (!config.events.length) continue;
      if (!config.postingChannelId) continue;

      const postingChannel: TextChannel | null = await client.channels.fetch(config.postingChannelId) as TextChannel | null;
      if (!postingChannel) continue;

      for (const trigger of config.reminders) {
        if (!trigger.timeDelta) continue;
        const triggerTime: dayjs.Dayjs = dayjs(trigger.timeDelta, "HH:mm", true);
        for (const event of config.events) {
          const eventTime: dayjs.Dayjs = dayjs(event.dateTime);
          if (!now.isSame(eventTime, "date")) continue;
          console.log("date check passed");
          if (eventTime.diff(triggerTime, "minutes") === 0) {
            console.log("time difference check passed");
            const messageValues: { [key: string]: string } = {
              everyone: "@everyone",
              eventName: event.name,
              hourDiff: triggerTime.hour.toString(),
              minuteDiff: triggerTime.minute.toString()
            };

            await postingChannel.send(trigger.message.replace(/%\w+%/g, (v) => messageValues[v] || v));
          }
        }
      }

      for (const past of config.events.filter(event => now.isAfter(dayjs(event.dateTime)))) {
        config.events.splice(config.events.indexOf(past), 1);
      }
    } catch (error) { console.error(error); }
  }
}

async function event(interaction: CommandInteraction) {
  let config: DefaultConfig | null = (interaction.client as Client).configs.getConfig<DefaultConfig>(moduleName, interaction.guildId);

  if (!config) {
    config = new DefaultConfig();
    (interaction.client as Client).configs.setConfig(moduleName, interaction.guildId, config);
  }

  const embed: MessageEmbed = new MessageEmbed().setColor("RANDOM");

  const index = interaction.options.getInteger("index");
  if (index !== null) {
    const event: EventObj = config.events[index % config.events.length];
    embed.setTitle(event.name);
    embed.setDescription(event.description);

    for (const [key, value] of Object.entries(event.additional)) {
      embed.addField(key, value, false);
    }

    const time: number = dayjs(event.dateTime).unix();
    embed.addField("Time remaining:", `<t:${time}:R>`, false);
    embed.addField("Set For:", `<t:${time}:f>`, false);
  } else {
    embed.setTitle("Upcoming Events");

    if (config.events.length > 0) {
      for (const [index, event] of config.events.entries()) {
        embed.addField(`Index ${index}:`, `${event.name}\n**Begins: <t:${dayjs(event.dateTime).unix()}:R>**`, false);
      }
    } else {
      embed.addField("Notice", "There are no upcoming events!");
    }
  }
  await interaction.reply({ embeds: [embed] });
}

export { messageCreateListener, messageUpdateListener, messageDeleteListener, postEventRemindersLoop, event };
