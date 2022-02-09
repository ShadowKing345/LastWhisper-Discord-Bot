var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { initConfigs } from "../appConfigs.js";
import { loadedModules } from "../moduleConfiguration.js";
const appConfigs = initConfigs();
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
const rest = new REST({ version: "9" }).setToken(appConfigs.token);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const commands = [];
    loadedModules.forEach(module => module.commands.forEach(command => commands.push(command.command.toJSON())));
    try {
        if (appConfigs.registerGuildCommands) {
            console.log("Beginning to unregister application commands for guild.");
            yield rest.get(Routes.applicationGuildCommands(appConfigs.clientId, appConfigs.guildId)).then((data) => {
                const promises = [];
                for (const command of data) {
                    promises.push(rest.delete(`${Routes.applicationGuildCommands(appConfigs.clientId, appConfigs.guildId)}/${command.id}`));
                }
                return Promise.all(promises);
            });
            console.log("Successfully unregistered application commands for guild.");
        }
        else {
            console.log("Beginning to unregister application commands globally.");
            yield rest.get(Routes.applicationCommands(appConfigs.clientId)).then((data) => {
                const promises = [];
                for (const command of data) {
                    promises.push(rest.delete(`${Routes.applicationCommands(appConfigs.clientId)}/${command.id}`));
                }
                return Promise.all(promises);
            });
            console.log("Successfully unregistered application globally.");
        }
    }
    catch (error) {
        console.error(error);
    }
}))();
//# sourceMappingURL=unregisterCommands.js.map