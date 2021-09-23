import dayjs from "dayjs";
import { Channel, GuildAuditLogsEntry, GuildBan, GuildMember, MessageEmbed, TextBasedChannel, TextChannel, User } from "discord.js";
import Client from "../Client";
import { DefaultConfigs } from "../objects/mangerUtils";

const moduleName = "managerUtils";

async function getLoggingChannel(client: Client, guildId: string) {
  let config: DefaultConfigs | null = await client.configs.getConfig<DefaultConfigs>(moduleName, guildId);

  if (!config) {
    config = new DefaultConfigs();
    client.configs.setConfig(moduleName, guildId, config);
  }

  if (!config.loggingChannel) return null;
  const loggingChannel: Channel | null = await client.channels.fetch(config.loggingChannel);
  return loggingChannel && typeof loggingChannel === typeof TextChannel ? loggingChannel as TextChannel : null;
}

async function onMemberLeave(member: GuildMember) {
  const loggingChannel: TextChannel | null = await getLoggingChannel(member.client as Client, member.guild.id);
  if (!loggingChannel) return;

  const kickedData: GuildAuditLogsEntry | undefined = (await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_KICK" })).entries.first();

  const embed = new MessageEmbed()
    .setColor("RANDOM")
    .addFields(
      { name: "Joined On:", value: dayjs(member.joinedAt).format("HH:mm:ss DD/MM/YYYY") },
      { name: "Nickname was:", value: member.nickname ?? "None" },
      { name: "Roles:", value: member.roles.cache.map(role => role.toString()).join(" ") })
    .setThumbnail(member.user.displayAvatarURL());

  if (kickedData && (kickedData.target as User).id === member.id) {
    embed.setTitle("User Kicked!")
      .setDescription(`User **${member.displayName}** was kicked by **${(await member.guild.members.fetch((kickedData.executor as User).id)).displayName}** from the server.`);
  }
  else {
    embed.setTitle("User Left!")
      .setDescription(`User **${member.displayName}** has left this discord server`)
  }

  await loggingChannel.send({ embeds: [embed] });
}

async function onMemberBanned(ban: GuildBan) {
  const loggingChannel: TextChannel | null = await getLoggingChannel(ban.client as Client, ban.guild.id);
  if (!loggingChannel) return;

  const banLogs = (await ban.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" })).entries.first();

  if (banLogs) {
    const executor: User | null = banLogs.executor;
    const target: User | null = banLogs.target as User;

    const embed = new MessageEmbed()
      .setTitle("Member Banned!")
      .setColor("RANDOM");

    if (target) {
      embed
        .setDescription(`User **${target.tag}** was banned by ${executor ? (await ban.guild.members.fetch(executor.id)).displayName : "Someone who was not part of the server somehow... what how?? "}!`)
        .setThumbnail(target.displayAvatarURL());
    } else {
      embed.setDescription("Somehow a user was banned but we cannot find out who it was!");
    }

    await loggingChannel.send({ embeds: [embed] });
  } else {
    await loggingChannel.send("A ban somehow occured but no logs about it could be found!");
  }
}

export { onMemberLeave, onMemberBanned };
