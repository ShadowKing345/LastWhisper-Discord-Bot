import {Intents} from "discord.js";
import Client from "./classes/Client";
import moduleSetup from "./modules";
import dotenv from "dotenv";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dotenv.config();

dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

console.log(`Current Timezone is set to ${process.env.TZ}`);

const client: Client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});

client.once("ready", () => {
    console.log("Ready!");
});

client.configs.loadConfigs()
    .then(() => moduleSetup(client))
    .then(() => client.login(process.env.TOKEN))
    .catch(err => console.error(err));
