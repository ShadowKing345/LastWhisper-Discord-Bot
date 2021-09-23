import { Intents } from "discord.js";
import Client from "./Client";
import commandsSetup from "./commands";
import tasksSetup from "./tasks";
import listenersSetup from "./listeners";
import permissionsSetup from "./permissionManager";
import dotenv from "dotenv";

dotenv.config();

const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.once("ready", () => {
  console.log("Ready!");
});

(async () => {
  await client.configs.loadConfigs();
  await commandsSetup(client);
  await tasksSetup(client);
  await listenersSetup(client);
  await permissionsSetup(client);
  await client.login(process.env.TOKEN);
})()
