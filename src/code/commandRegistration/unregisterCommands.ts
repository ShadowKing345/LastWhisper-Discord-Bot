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
    const useGuild = JSON.parse(process.env["USEGUILD"]);
    const commands: {}[] = [];
    readModules(module => module.commands.forEach(command => commands.push((command.command as SlashCommandBuilder).toJSON())));

    try {
        if (useGuild) {
            console.log("Beginning to unregister application commands for guild.")
            await rest.get(Routes.applicationGuildCommands(appConfigs.getClientId, appConfigs.getGuildId)).then((data: { id: string }[]) => {
                const promises = [];
                for (const command of data) {
                    promises.push(rest.delete(`${Routes.applicationGuildCommands(appConfigs.getClientId, appConfigs.getGuildId)}/${command.id}`));
                }
                return Promise.all(promises);
            });
            console.log("Successfully unregistered application commands for guild.");
        } else {
            console.log("Beginning to unregister application commands globally.")
            await rest.get(Routes.applicationCommands(appConfigs.getClientId)).then((data: { id: string }[]) => {
                const promises = [];
                for (const command of data) {
                    promises.push(rest.delete(`${Routes.applicationCommands(appConfigs.getClientId)}/${command.id}`));
                }
                return Promise.all(promises);
            });
            console.log("Successfully unregistered application globally.");
        }
    } catch (error) {
        console.error(error);
    }
})()
