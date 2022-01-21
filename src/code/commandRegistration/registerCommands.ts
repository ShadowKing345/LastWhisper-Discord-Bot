import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {readModules} from "../modules";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {AppConfigs, getConfigs} from "../configurations/appConfigs";
import {SlashCommandBuilder} from "@discordjs/builders";

const appConfigs: AppConfigs = getConfigs();
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
const rest = new REST({version: "9"}).setToken(appConfigs.getToken);

(async () => {
    const isDev = JSON.parse(process.env["USEGUILD"]);
    const commands: {}[] = [];
    readModules(module => module.commands.forEach(command => commands.push(typeof command.command === "function" ? command.command(new SlashCommandBuilder()).toJSON() : (command.command as SlashCommandBuilder).toJSON())));

    try {
        if (isDev) {
            await rest.put(Routes.applicationGuildCommands(appConfigs.getClientId, appConfigs.getGuildId), {body: commands});
            console.log("Successfully registered application commands for guild.");
        } else {
            await rest.put(Routes.applicationCommands(appConfigs.getClientId), {body: commands});
            console.log("Successfully registered application commands.");
        }
    } catch (error) {
        console.error(error);
    }
})()
