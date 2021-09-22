import { Message, PartialMessage } from "discord.js";
import Client from "../../Client";
import { messageUpdateListener } from "../../modules/evenManager";
import { Listener } from "..";

async function listen(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
  await messageUpdateListener(oldMessage, newMessage);
}

export default new Listener((client: Client) => client.on("messageUpdate", listen));
