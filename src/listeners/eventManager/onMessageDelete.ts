import { Message, PartialMessage } from "discord.js";
import Client from "../../Client";
import { messageDeleteListener } from "../../modules/evenManager";
import { Listener } from "..";

async function listen(message: Message | PartialMessage) {
  await messageDeleteListener(message);
}

export default new Listener((client: Client) => client.on("messageDelete", listen));
