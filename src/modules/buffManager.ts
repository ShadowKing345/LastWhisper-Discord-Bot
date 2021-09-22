import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import cusomParseFormat from "dayjs/plugin/customParseFormat";
import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import Client from "../Client";
import { Day, DefaultConfig, MessageSettings, Week } from "../objects/buffManager";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(cusomParseFormat);

const moduleName = "buffManager";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function createDayEmbed(title: string, day: Day, date: dayjs.Dayjs): MessageEmbed {
  return new MessageEmbed()
    .setColor("RANDOM")
    .setTitle(title)
    .setDescription(day.text)
    .setThumbnail(day.imageUrl)
    .setFooter(date.format("dddd Do MMMM YYYY"));
}

function createWeekEmbed(title: string, week: Week, days: Day[], date: dayjs.Dayjs): MessageEmbed {
  const _days = week.days.map((dayId, index) => {
    const dow: string = weekDays[index];
    const day: Day = days.find(entry => entry.id === dayId) || new Day("No Buff Found", "")

    return { name: dow, value: day.text, inline: true };
  });

  return new MessageEmbed()
    .setColor("RANDOM")
    .setTitle(title)
    .setDescription(week.title)
    .addFields(_days)
    .setFooter(`Week ${date.week()}.`);

}

async function postBuff(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
  const client: Client = interaction.client as Client;
  let config: DefaultConfig | null = client.configs.getConfig<DefaultConfig>(moduleName, interaction.guildId);

  if (!config) {
    config = new DefaultConfig();
    client.configs.setConfig(moduleName, interaction.guildId, config);
  }

  if (!config.days.length) { await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true }); return; }
  if (!config.weeks.length) { await interaction.reply({ content: "Sorry, there are not weeks set.", ephemeral: true }); return; }

  const week = config.weeks[date.week() % config.weeks.length];
  const day = config.days.find(day => day.id === week.days[date.day()]);

  if (!day) {
    await interaction.reply({ content: `Sorry, but the buff with id ${week.days[date.day()]} does not actually exist!\nKindly contact your FC admin/manager to fix this issue.`, ephemeral: true });
    return;
  }

  await interaction.reply({ embeds: [createDayEmbed(title, day, date)] });
}

async function postWeeksBuffs(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
  const client: Client = interaction.client as Client;
  let config: DefaultConfig | null = client.configs.getConfig<DefaultConfig>(moduleName, interaction.guildId);

  if (!config) {
    config = new DefaultConfig();
    client.configs.setConfig(moduleName, interaction.guildId, config);
  }

  if (!config.days.length) { await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true }); return; }
  if (!config.weeks.length) { await interaction.reply({ content: "Sorry, there are not weeks set.", ephemeral: true }); return; }

  const week = config.weeks[date.week() % config.weeks.length];
  await interaction.reply({ embeds: [createWeekEmbed(title, week, config.days, date)] });
}

async function postDailyMessage(client: Client) {
  const configs: { [guildId: string]: DefaultConfig } = client.configs.getConfigs(moduleName);

  for (const [guildId, guildConfig] of Object.entries(configs)) {
    try {
      const config: MessageSettings = guildConfig.messageSettings;
      if (!config.channelId || !config.hour) continue;
      const now = dayjs();
      if (!now.isSame(dayjs(config.hour, "HH:mm", true), "minute")) continue;
      if (!guildConfig.days.length || !guildConfig.weeks.length) continue;

      const channel: TextChannel | null = await client.channels.fetch(config.channelId) as TextChannel | null;

      if (!channel) { console.warn(`Invalid posting channel for ${guildId}`); continue; }

      const week: Week = guildConfig.weeks[now.week() % guildConfig.weeks.length];
      const day: Day | undefined = guildConfig.days.find(day => day.id === week.days[now.day()]);

      if (!day) { console.warn(`Invalid day id for guild ${guildId}`); continue; }

      await channel.send({ embeds: [createDayEmbed(config.buffMessage, day, now)] });

      if (!config.dow || config.dow !== now.day()) continue;
      await channel.send({ embeds: [createWeekEmbed(config.weekMessage, week, guildConfig.days, now)] });
    } catch (error) { console.log(error); }
  }
}

export { postBuff, postWeeksBuffs, postDailyMessage };
