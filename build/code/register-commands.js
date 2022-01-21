"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const modules_1 = require("./modules");
const dayjs_1 = __importDefault(require("dayjs"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.extend(duration_1.default);
dayjs_1.default.extend(weekOfYear_1.default);
dayjs_1.default.extend(advancedFormat_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
const rest = new rest_1.REST({ version: "9" }).setToken(process.env.TOKEN);
(async () => {
    try {
        const commands = [];
        (0, modules_1.readModules)(module => module.commands.forEach(command => commands.push(command.command.toJSON())));
        await rest.put(v9_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log("Successfully registered application commands.");
    }
    catch (error) {
        console.error(error);
    }
})();
