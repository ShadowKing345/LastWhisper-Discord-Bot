import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {readModules} from "./modules";
import dotenv from "dotenv";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dotenv.config();

dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
const rest = new REST({version: "9"}).setToken(process.env.TOKEN as string);

(async () => {
    try {
        const commands: {}[] = [];
        readModules(module => module.commands.forEach(command => commands.push(command.command.toJSON())));
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), {body: commands});
        console.log("Successfully registered application commands.");
    } catch (error) {
        console.error(error);
    }
})()
