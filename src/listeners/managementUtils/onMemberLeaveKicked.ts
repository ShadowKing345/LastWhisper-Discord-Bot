import { GuildMember, PartialGuildMember } from "discord.js";
import Client from "../../Client";
import { onMemberLeave } from "../../modules/managerUtils";
import { Listener } from "..";

async function listen(member: GuildMember | PartialGuildMember) {
  await onMemberLeave(member as GuildMember);
}

export default new Listener((client: Client) => client.on("guildMemberRemove", listen));
