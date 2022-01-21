"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const modules_1 = require("../modules");
const dayjs_1 = __importDefault(require("dayjs"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const appConfigs_1 = require("../configurations/appConfigs");
const builders_1 = require("@discordjs/builders");
const appConfigs = (0, appConfigs_1.getConfigs)();
dayjs_1.default.extend(duration_1.default);
dayjs_1.default.extend(weekOfYear_1.default);
dayjs_1.default.extend(advancedFormat_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
const rest = new rest_1.REST({ version: "9" }).setToken(appConfigs.getToken);
(async () => {
    const isDev = JSON.parse(process.env["USEGUILD"]);
    const commands = [];
    (0, modules_1.readModules)(module => module.commands.forEach(command => commands.push(typeof command.command === "function" ? command.command(new builders_1.SlashCommandBuilder()).toJSON() : command.command.toJSON())));
    try {
        if (isDev) {
            await rest.put(v9_1.Routes.applicationGuildCommands(appConfigs.getClientId, appConfigs.getGuildId), { body: commands });
            console.log("Successfully registered application commands for guild.");
        }
        else {
            await rest.put(v9_1.Routes.applicationCommands(appConfigs.getClientId), { body: commands });
            console.log("Successfully registered application commands.");
        }
    }
    catch (error) {
        console.error(error);
    }
})();
