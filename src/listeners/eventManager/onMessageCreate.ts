import { Message } from "discord.js";
import Client from "../../Client";
import { messageCreateListener } from "../../modules/evenManager";
import { Listener } from "..";

async function listen(message: Message) {
  await messageCreateListener(message);
}

export default new Listener((client: Client) => client.on("messageCreate", listen));
