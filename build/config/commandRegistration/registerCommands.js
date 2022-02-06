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
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { initConfigs } from "../appConfigs";
import { SlashCommandBuilder } from "@discordjs/builders";
import { loadedModules } from "../moduleConfiguration.js";
const appConfigs = initConfigs();
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
const rest = new REST({ version: "9" }).setToken(appConfigs.token);
(() => __awaiter(void 0, void 0, void 0, function* () {
    const commands = [];
    loadedModules.forEach(module => module.commands.forEach(command => commands.push(typeof command.command === "function" ? command.command(new SlashCommandBuilder()).toJSON() : command.command.toJSON())));
    try {
        if (appConfigs.registerGuildCommands) {
            yield rest.put(Routes.applicationGuildCommands(appConfigs.clientId, appConfigs.guildId), { body: commands });
            console.log("Successfully registered application commands for guild.");
        }
        else {
            yield rest.put(Routes.applicationCommands(appConfigs.clientId), { body: commands });
            console.log("Successfully registered application commands.");
        }
    }
    catch (error) {
        console.error(error);
    }
}))();
//# sourceMappingURL=registerCommands.js.map