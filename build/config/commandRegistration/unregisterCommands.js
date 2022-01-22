"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const dayjs_1 = __importDefault(require("dayjs"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const weekOfYear_1 = __importDefault(require("dayjs/plugin/weekOfYear"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const appConfigs_1 = require("../appConfigs");
const moduleConfiguration_1 = require("../moduleConfiguration");
const appConfigs = (0, appConfigs_1.initConfigs)();
dayjs_1.default.extend(duration_1.default);
dayjs_1.default.extend(weekOfYear_1.default);
dayjs_1.default.extend(advancedFormat_1.default);
dayjs_1.default.extend(customParseFormat_1.default);
const rest = new rest_1.REST({ version: "9" }).setToken(appConfigs.token);
(async () => {
    const commands = [];
    moduleConfiguration_1.loadedModules.forEach(module => module.commands.forEach(command => commands.push(command.command.toJSON())));
    try {
        if (appConfigs.registerGuildCommands) {
            console.log("Beginning to unregister application commands for guild.");
            await rest.get(v9_1.Routes.applicationGuildCommands(appConfigs.clientId, appConfigs.guildId)).then((data) => {
                const promises = [];
                for (const command of data) {
                    promises.push(rest.delete(`${v9_1.Routes.applicationGuildCommands(appConfigs.clientId, appConfigs.guildId)}/${command.id}`));
                }
                return Promise.all(promises);
            });
            console.log("Successfully unregistered application commands for guild.");
        }
        else {
            console.log("Beginning to unregister application commands globally.");
            await rest.get(v9_1.Routes.applicationCommands(appConfigs.clientId)).then((data) => {
                const promises = [];
                for (const command of data) {
                    promises.push(rest.delete(`${v9_1.Routes.applicationCommands(appConfigs.clientId)}/${command.id}`));
                }
                return Promise.all(promises);
            });
            console.log("Successfully unregistered application globally.");
        }
    }
    catch (error) {
        console.error(error);
    }
})();
