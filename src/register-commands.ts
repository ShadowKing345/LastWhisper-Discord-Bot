import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { readCommands } from "./commands/commands";
import dotenv from "dotenv";
dotenv.config()

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN as string);

(async () => {
  try {
    const commands: object[] = [];
    await readCommands(module => { (module.command && module.command.toJSON) && commands.push(module.command.toJSON()) });
    await rest.put(Routes.applicationCommands(process.env.CLIENTID as string), { body: commands });
    console.log("Successfully registered application commands.");
  } catch (error) { console.error(error); }
})()
