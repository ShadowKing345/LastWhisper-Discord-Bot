import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import dotenv from "dotenv";
import {readModules} from "./modules";

dotenv.config();

const rest = new REST({version: "9"}).setToken(process.env.TOKEN as string);

(async () => {
    try {
        const commands: {}[] = [];
        await readModules(module => module.commands.forEach(command => commands.push(command.command.toJSON())));
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), {body: commands});
        console.log("Successfully registered application commands.");
    } catch (error) {
        console.error(error);
    }
})()
