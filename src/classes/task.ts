import chalk from "chalk";
import { Client as DiscordClient } from "discord.js";

import { buildLogger } from "../utils/logger.js";
import { Client } from "./client.js";

export class Task {
    private static readonly logger = buildLogger(Task.name);
    public name: string;
    public timeout: number;
    public run: (client: Client) => Promise<void>;

    public static async waitTillReady(client: DiscordClient, checkAgainTime = 500) {
        Task.logger.debug(`Waiting for ${chalk.cyan("client")} to be ready.`, { context: "Task#WaitTillReady" });
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}
