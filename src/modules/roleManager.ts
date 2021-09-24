import { Guild, GuildMember, Message, MessageReaction, Role, User } from "discord.js";
import Client from "../Client";
import { DefaultConfigs } from "../objects/roleManager";
import { fetchMessages } from "./utils";

const moduleName = "roleManager";

async function getConfig(client: Client, guildId: string): Promise<DefaultConfigs> {
  let config: DefaultConfigs | null = await client.configs.getConfig<DefaultConfigs>(moduleName, guildId);

  if (!config) {
    config = new DefaultConfigs();
    client.configs.setConfig(moduleName, guildId, config);
  }

  return config;
}

async function alterMembersRoles(member: GuildMember, newMemberRoleId: string, memberRoleId: string) {
  if (memberRoleId) {
    const memberRole: Role | null = await member.guild.roles.fetch(memberRoleId);
    if (memberRole) {
      await member.roles.add(memberRole);
    }
  }

  if (newMemberRoleId) {
    const newMemberRole: Role | null = await member.guild.roles.fetch(newMemberRoleId);
    if (newMemberRole) {
      await member.roles.remove([newMemberRole]);
    }
  }
}

async function onReady(client: Client) {
  let configs: { [guildId: string]: DefaultConfigs } = await client.configs.getConfigs(moduleName);

  for (const [guildId, config] of Object.entries(configs)) {
    if (!config.reactionListeningChannel || !config.reactionMessageIds.length) continue;
    const messages: Message[] | void = await fetchMessages(client, guildId, config.reactionListeningChannel, config.reactionMessageIds).catch(error => console.error(error));

    if (!messages) continue;
    const guild: Guild | null = await client.guilds.fetch(guildId);
    if (!guild) continue;

    for (const message of messages) {
      for (const reaction of message.reactions.cache.values()) {
        await reaction.users.fetch();
        for (const user of reaction.users.cache.values()) {
          try {
            const member: GuildMember | null = await guild.members.fetch(user.id);
            if (member) await alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);
          } catch (error) { console.error(error); }
        }
      }

      await message.reactions.removeAll();
    }
  }
}

async function onMemberJoin(member: GuildMember) {
  const config: DefaultConfigs = await getConfig(member.client as Client, member.guild.id);

  if (!config.newUserRoleId) return;

  const newMemberRole: Role | null = await member.guild.roles.fetch(config.newUserRoleId);

  if (newMemberRole)
    await member.roles.add([newMemberRole], "Bot added.");
}

async function onReactionAdd(messageReaction: MessageReaction, user: User) {
  if (user.bot) return;
  const guild: Guild | null = messageReaction.message.guild;
  if (!guild) return;

  const member: GuildMember | null = await guild.members.fetch(user.id);
  if (!member) { console.error("How the actual... did a user that is not in the guild react to a message?"); return; }

  const config: DefaultConfigs = await getConfig(messageReaction.client as Client, guild.id);
  await alterMembersRoles(member, config.newUserRoleId, config.memberRoleId);

  await messageReaction.remove();
}

export { onMemberJoin, onReactionAdd, onReady };
