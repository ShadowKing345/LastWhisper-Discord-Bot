import { GuildMember, PartialGuildMember } from "discord.js";
import { Listener } from "..";
import Client from "../../Client";
import { onMemberJoin } from "../../modules/roleManager";

async function listener(member: GuildMember | PartialGuildMember) {
  if (member.partial) await member.fetch();
  await onMemberJoin(member as GuildMember);
}

export default new Listener((client: Client) => client.on("guildMemberAdd", listener));
