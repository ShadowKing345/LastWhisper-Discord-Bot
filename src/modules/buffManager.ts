import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import cusomParseFormat from "dayjs/plugin/customParseFormat";
import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import Client from "../Client";
import { Day, DefaultConfigs, MessageSettings, Week } from "../objects/buffManager";

dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(cusomParseFormat);

const moduleName = "buffManager";

const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

async function getConfig(client: Client, guildId: string): Promise<DefaultConfigs> {
  let config: DefaultConfigs | null = await client.configs.getConfig<DefaultConfigs>(moduleName, guildId);

  if (!config) {
    config = new DefaultConfigs();
    client.configs.setConfig(moduleName, guildId, config);
  }

  return config
}

async function postBuff(interaction: CommandInteraction, date: dayjs.Dayjs, title: string) {
  if (!interaction.guildId) return;
  const config: DefaultConfigs = await getConfig(interaction.client as Client, interaction.guildId);

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
  if (!interaction.guildId) return;
  const config: DefaultConfigs = await getConfig(interaction.client as Client, interaction.guildId);

  if (!config.days.length) { await interaction.reply({ content: "Sorry, there are not buffs set.", ephemeral: true }); return; }
  if (!config.weeks.length) { await interaction.reply({ content: "Sorry, there are not weeks set.", ephemeral: true }); return; }

  const week = config.weeks[date.week() % config.weeks.length];
  await interaction.reply({ embeds: [createWeekEmbed(title, week, config.days, date)] });
}

async function postDailyMessage(client: Client) {
  const configs: { [guildId: string]: DefaultConfigs } = await client.configs.getConfigs(moduleName);
  const now: dayjs.Dayjs = dayjs();

  for (const [guildId, guildConfig] of Object.entries(configs)) {
    try {
      const config: MessageSettings = guildConfig.messageSettings;
      if (!config.channelId || !config.hour) continue;
      if (!now.isSame(dayjs(config.hour, "HH:mm", true), "minute")) continue;
      if (!guildConfig.days.length || !guildConfig.weeks.length) continue;

      const channel: TextChannel | null = await client.channels.fetch(config.channelId) as TextChannel | null;

      if (!channel) { console.warn(`Invalid posting channel for ${guildId}`); continue; }

      const week: Week = guildConfig.weeks[now.week() % guildConfig.weeks.length];
      const day: Day | undefined = guildConfig.days.find(day => day.id === week.days[now.day()]);

      if (!day) { console.warn(`Invalid day id for guild ${guildId}`); continue; }

      await channel.send({ embeds: [createDayEmbed(config.buffMessage, day, now)] });


      if (config.dow && config.dow === now.day())
        await channel.send({ embeds: [createWeekEmbed(config.weekMessage, week, guildConfig.days, now)] });
    } catch (error) { console.log(error); }
  }
}

export { postBuff, postWeeksBuffs, postDailyMessage };
