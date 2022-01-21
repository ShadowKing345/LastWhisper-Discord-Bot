import {Intents} from "discord.js";
import Client from "./classes/Client";
import moduleSetup from "./modules";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {getConfigs} from "./configurations/appConfigs";
import ConfigManager from "./configManager";

dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

const appConfigs = getConfigs();
const client: Client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]});

client.once("ready", () => {
    console.log("Discord Bot is now loaded and ready to be used!");
});

ConfigManager.establishDBConnection(appConfigs)
    .then(() => moduleSetup(client))
    .then(() => client.login(appConfigs.getToken))
    .catch(err => console.error(err));
