"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Client_1 = __importDefault(require("./classes/Client"));
const modules_1 = __importDefault(require("./modules"));
const dayjs_1 = __importDefault(require("dayjs"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const appConfigs_1 = require("./configurations/appConfigs");
const configManager_1 = __importDefault(require("./configManager"));
dayjs_1.default.extend(duration_1.default);
dayjs_1.default.extend(weekOfYear_1.default);
dayjs_1.default.extend(advancedFormat_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
const appConfigs = (0, appConfigs_1.getConfigs)();
const client = new Client_1.default({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_MEMBERS, discord_js_1.Intents.FLAGS.GUILD_BANS, discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
client.once("ready", () => {
    console.log("Discord Bot is now loaded and ready to be used!");
});
configManager_1.default.establishDBConnection(appConfigs)
    .then(() => (0, modules_1.default)(client))
    .then(() => client.login(appConfigs.getToken))
    .catch(err => console.error(err));
