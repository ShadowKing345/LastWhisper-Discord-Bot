import { DefaultConfig, EventObj, Tags } from "../objects/eventManager";
import dayjs from "dayjs";
import CustomParseFormat from "dayjs/plugin/customParseFormat";
import AdvancedFormat from "dayjs/plugin/advancedFormat";
import Duration from "dayjs/plugin/duration";
import { CommandInteraction, Message, MessageEmbed, TextChannel } from "discord.js";
import Client from "../Client";

const moduleName = "eventManager";

dayjs.extend(CustomParseFormat);
dayjs.extend(AdvancedFormat);
dayjs.extend(Duration);

function getDict(array: [string], tags: [string]) {
  const r: { [key: string]: string } = {};
  tags.forEach(t => {
    const keyIndex = array.indexOf(t);
    if (keyIndex + 1 >= array.length) return;
    r[array[keyIndex]] = array[keyIndex + 1];
  });
  return r;
}

function parseMessage(messageId: string, content: string, matchTags: [string], re: RegExp, tags: Tags, dateTimeFormat: Array<string>): EventObj {
  const event = new EventObj(messageId);
  const hammerRegex: RegExp = /\:(.*?)\:/

  const patternSplit: [string] = content.split(re).map(l => l.replace("\n", "").trim()) as [string];
  const splittedContent: { [key: string]: string } = getDict(patternSplit, matchTags);

  for (const [key, content] of Object.entries(splittedContent)) {
    switch (key) {
      case tags.announcement:
        event.name = content;
        break;
      case tags.description:
        event.description = content;
        break;
      case tags.dateTime:
        let date: dayjs.Dayjs = dayjs(content, dateTimeFormat, true);
        if (date.isValid()) {
          event.dateTime = date.format();
          break;
        }

        // Checks if it's hammer time.
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
        if (key in tags.exclusionList) continue;
        event.additional[key] = content;
        break;
    }
  }

  return event;
}

async function getConfig(client: Client, guildId: string): Promise<DefaultConfig> {
  var config: DefaultConfig | null = await client.configs.getConfig(moduleName, guildId) as DefaultConfig | null;
  if (!config) {
    config = new DefaultConfig();
    client.configs.setConfig(moduleName, guildId, config);
  }

  return config;
}

async function messageCreateListener(message: Message) {
  if (message.author.id === message.client.application?.id) return;
  if (!message.guildId) return;
  const config: DefaultConfig = await getConfig(message.client as Client, message.guildId);

  if (!config.listenerChannelId || message.channelId !== config.listenerChannelId) return;
  const [l, r] = config.delimiterCharacters;
  const matchTags: [string] = message.content.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g"))?.map(l => l.trim()) as [string];
  const re: RegExp = new RegExp(`${l}(.*?)${r}`);
  if (!matchTags.includes(config.tags.announcement)) return;

  const event: EventObj = parseMessage(message.id, message.content, matchTags, re, config.tags, config.dateTimeFormat);
  try {
    if (event.isValid()) {
      config.events.push(event);
      await message.react("✅");
      await (message.client as Client).configs.setConfig(moduleName, message.guildId, config);
    } else {
      await message.react("❎");
    }
  } catch (error) { console.error(error); }
}

async function messageUpdateListener(oldMessage: Message, newMessage: Message) {
  if (newMessage.author?.id === newMessage.client.application?.id) return;
  if (!oldMessage.guildId) return;
  const config: DefaultConfig = await getConfig(oldMessage.client as Client, oldMessage.guildId);

  if (!config.listenerChannelId || oldMessage.channelId !== config.listenerChannelId) return;
  const oldEvent = config.events.find(event => event.messageId === oldMessage.id);
  if (!oldEvent) return;

  const [l, r] = config.delimiterCharacters;
  const matchTags: [string] = newMessage.content.match(new RegExp(`(?<=${l})(.*?)(?=${r})`, "g"))?.map(l => l.trim()) as [string];
  const re: RegExp = new RegExp(`${l}(.*?)${r}`);

  const newEvent = parseMessage(newMessage.id, (newMessage as Message).content, matchTags, re, config.tags, config.dateTimeFormat);

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
      await (newMessage.client as Client).configs.setConfig(moduleName, newMessage.guildId, config);
    } else {
      await newMessage.react("❎");
    }
  } catch (error) { console.error(error); }
}

async function messageDeleteListener(message: Message) {
  if (message.author?.id === message.client.application?.id) return;
  if (!message.guildId) return;
  const config: DefaultConfig = await getConfig(message.client as Client, message.guildId);

  if (!config.listenerChannelId || message.channelId !== config.listenerChannelId) return;
  if (!config.events.find(event => event.messageId === message.id)) return;

  config.events.splice(config.events.findIndex(event => event.messageId === message.id), 1);
  await (message.client as Client).configs.setConfig(moduleName, message.guildId, config);
}

function parseTriggerDuration(triggerTime: string) {
  const hold = dayjs(triggerTime, "HH:mm", true);
  return dayjs.duration({ hours: hold.hour(), minutes: hold.minute() });
}

async function postEventRemindersLoop(client: Client) {
  const now: dayjs.Dayjs = dayjs();
  const configs: { [guildId: string]: DefaultConfig } = await client.configs.getConfigs(moduleName);

  for (const [guildId, config] of Object.entries(configs)) {
    try {
      if (!config.events.length) continue;
      if (!config.postingChannelId) continue;

      const postingChannel: TextChannel | null = await client.channels.fetch(config.postingChannelId) as TextChannel | null;
      if (!postingChannel) continue;

      for (const trigger of config.reminders) {
        if (!trigger.timeDelta) continue;
        const triggerTime = parseTriggerDuration(trigger.timeDelta);
        for (const event of config.events) {
          const eventTime = dayjs(event.dateTime);
          if (!now.isSame(eventTime, "date")) continue;
          if (eventTime.diff(now, "minutes") === triggerTime.asMinutes()) {
            const messageValues: { [key: string]: string } = {
              "%everyone%": "@everyone",
              "%eventName%": event.name,
              "%hourDiff%": triggerTime.hours().toString(),
              "%minuteDiff%": triggerTime.minutes().toString()
            };

            await postingChannel.send(trigger.message.replace(/%\w+%/g, (v) => messageValues[v] || v));
          }
        }
      }

      const before = config.events.length;

      for (const past of config.events.filter(event => now.isAfter(dayjs(event.dateTime)))) {
        config.events.splice(config.events.indexOf(past), 1);
      }

      if (before !== config.events.length)
        await client.configs.setConfig(moduleName, guildId, config);
    } catch (error) { console.error(error); }
  }
}

async function event(interaction: CommandInteraction) {
  let config: DefaultConfig | null = await (interaction.client as Client).configs.getConfig<DefaultConfig>(moduleName, interaction.guildId);

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
