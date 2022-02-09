import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import weekOfYear from "dayjs/plugin/weekOfYear.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import {AppConfigs, initConfigs} from "../appConfigs.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {loadedModules} from "../moduleConfiguration.js";

const appConfigs: AppConfigs = initConfigs();
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
const rest = new REST({version: "9"}).setToken(appConfigs.token);

(async () => {
    const commands: {}[] = [];
    loadedModules.forEach(module => module.commands.forEach(command => commands.push(typeof command.command === "function" ? command.command(new SlashCommandBuilder()).toJSON() : (command.command as SlashCommandBuilder).toJSON())));

    try {
        if (appConfigs.registerGuildCommands) {
            await rest.put(Routes.applicationGuildCommands(appConfigs.clientId, appConfigs.guildId), {body: commands});
            console.log("Successfully registered application commands for guild.");
        } else {
            await rest.put(Routes.applicationCommands(appConfigs.clientId), {body: commands});
            console.log("Successfully registered application commands.");
        }
    } catch (error) {
        console.error(error);
    }
})()
