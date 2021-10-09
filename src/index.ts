import {Intents} from "discord.js";
import Client from "./classes/Client";
import moduleSetup from "./modules";
import dotenv from "dotenv";

dotenv.config();

console.log(`Current Timezone is set to ${process.env.TZ}`);

const client: Client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});

client.once("ready", () => {
    console.log("Ready!");
});

(async () => {
    await client.configs.loadConfigs();
    await moduleSetup(client);
    await client.login(process.env.TOKEN);
})()
