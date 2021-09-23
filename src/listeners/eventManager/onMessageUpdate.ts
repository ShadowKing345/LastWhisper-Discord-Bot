import { Message, PartialMessage } from "discord.js";
import Client from "../../Client";
import { messageUpdateListener } from "../../modules/evenManager";
import { Listener } from "..";

async function listen(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
  if(oldMessage.partial) await oldMessage.fetch();
  if(newMessage.partial) await newMessage.fetch();
  await messageUpdateListener(oldMessage as Message, newMessage as Message);
}

export default new Listener((client: Client) => client.on("messageUpdate", listen));
