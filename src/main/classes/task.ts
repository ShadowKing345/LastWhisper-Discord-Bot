import {Client} from "./client.js";
import {Client as DiscordClient} from "discord.js";
import {logger} from "../utils/logger.js";
import chalk from "chalk";

export class Task {
    public name: string;
    public timeout: number;
    public run: (client: Client) => Promise<void>;

    public static async waitTillReady(client: DiscordClient, checkAgainTime = 500) {
        logger.debug(`Waiting for ${chalk.cyan("client")} to be ready.`, {context: "Task#WaitTillReady"});
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}
