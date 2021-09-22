import { Channel, Guild, GuildMember, MessageReaction, Role, TextChannel, User } from "discord.js";
import Client from "../Client";
import { DefaultConfigs } from "../objects/roleManager";

const moduleName = "roleManager";

function getConfig(client: Client, guildId: string): DefaultConfigs {
  let config: DefaultConfigs | null = client.configs.getConfig<DefaultConfigs>(moduleName, guildId);

  if (!config) {
    config = new DefaultConfigs();
    client.configs.setConfig(moduleName, guildId, config);
  }

  return config;
}

async function onReady(client: Client) {
  let configs: { [guildId: string]: DefaultConfigs } = client.configs.getConfigs(moduleName);

  for (const [guildId, config] of Object.entries(configs)) {
    if (!config.reactionListeningChannel || config.reactionMessageIds.length <= 0) continue;
    const guild: Guild | null = await client.guilds.fetch(guildId);
    if (guild) {
      const channel: Channel | null = await guild.channels.fetch(config.reactionListeningChannel);
      if (channel && typeof channel === typeof TextChannel) {
        for (const messageId of config.reactionMessageIds)
          (channel as TextChannel).messages.fetch(messageId);
      }
    }
  }
}

async function onMemberJoin(member: GuildMember) {
  const config: DefaultConfigs = getConfig(member.client as Client, member.guild.id);

  if (!config.newUserRoleId) return;

  const newMemberRole: Role | null = await member.guild.roles.fetch(config.newUserRoleId);

  if (newMemberRole)
    await member.roles.add([newMemberRole], "Bot added.");
}

async function onReactionAdd(messageReaction: MessageReaction, user: User) {
  const guild: Guild | null = messageReaction.message.guild;
  if (!guild) return;

  const member: GuildMember | null = await guild.members.fetch(user.id);
  if (!member) { console.error("How the actual... did a user that is not in the guild react to a message?"); return; }

  const config: DefaultConfigs = getConfig(messageReaction.client as Client, guild.id);

  if (config.memberRoleId) {
    const memberRole: Role | null = await guild.roles.fetch(config.memberRoleId);
    if (memberRole)
      try { await member.roles.add(memberRole, "Bot added."); } catch (error) { console.error(error); }
  }

  if (config.newUserRoleId) {
    const newMemberRole: Role | null = await guild.roles.fetch(config.newUserRoleId);
    if (newMemberRole)
      try { await member.roles.remove([newMemberRole]); } catch (error) { console.error(error); }
  }
}

export { onMemberJoin, onReactionAdd, onReady };
