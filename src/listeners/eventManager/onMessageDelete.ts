import { Message, PartialMessage } from "discord.js";
import Client from "../../Client";
import { messageDeleteListener } from "../../modules/evenManager";
import { Listener } from "..";

async function listen(message: Message | PartialMessage) {
  if(message.partial) await message.fetch();
  await messageDeleteListener(message as Message);
}

export default new Listener((client: Client) => client.on("messageDelete", listen));
