import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import { Listener } from "..";
import Client from "../../Client";
import { onReactionAdd } from "../../modules/roleManager";

async function listener(messageReaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
  if (messageReaction.partial) await messageReaction.fetch();
  if (user.partial) await user.fetch();
  await onReactionAdd(messageReaction as MessageReaction, user as User);
}

export default new Listener((client: Client) => client.on("messageReactionAdd", listener));
