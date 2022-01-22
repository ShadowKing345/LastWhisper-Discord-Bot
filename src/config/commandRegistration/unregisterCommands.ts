import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {AppConfigs, initConfigs} from "../appConfigs";
import {SlashCommandBuilder} from "@discordjs/builders";
import {loadedModules} from "../moduleConfiguration";

const appConfigs: AppConfigs = initConfigs();
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
const rest = new REST({version: "9"}).setToken(appConfigs.token);

(async () => {
    const commands: {}[] = [];
    loadedModules.forEach(module => module.commands.forEach(command => commands.push((command.command as SlashCommandBuilder).toJSON())));

    try {
        if (appConfigs.registerGuildCommands) {
            console.log("Beginning to unregister application commands for guild.")
            await rest.get(Routes.applicationGuildCommands(appConfigs.clientId, appConfigs.guildId)).then((data: { id: string }[]) => {
                const promises = [];
                for (const command of data) {
                    promises.push(rest.delete(`${Routes.applicationGuildCommands(appConfigs.clientId, appConfigs.guildId)}/${command.id}`));
                }
                return Promise.all(promises);
            });
            console.log("Successfully unregistered application commands for guild.");
        } else {
            console.log("Beginning to unregister application commands globally.")
            await rest.get(Routes.applicationCommands(appConfigs.clientId)).then((data: { id: string }[]) => {
                const promises = [];
                for (const command of data) {
                    promises.push(rest.delete(`${Routes.applicationCommands(appConfigs.clientId)}/${command.id}`));
                }
                return Promise.all(promises);
            });
            console.log("Successfully unregistered application globally.");
        }
    } catch (error) {
        console.error(error);
    }
})()
