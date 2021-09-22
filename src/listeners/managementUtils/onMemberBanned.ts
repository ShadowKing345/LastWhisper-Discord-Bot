import { GuildBan } from "discord.js";
import Client from "../../Client";
import { onMemberBanned } from "../../modules/managerUtils";
import { Listener } from "..";

async function listen(ban: GuildBan) {
  await onMemberBanned(ban);
}

export default new Listener((client: Client) => client.on("guildBanAdd", listen));
