import { Client as DiscordClient } from "discord.js";
import { container } from "tsyringe";

import { classes, event } from "../logger/colors.js";
import { LoggerFactory } from "../logger/logger.js";
import { Client } from "./client.js";

export class Task {
    private static readonly logger = container.resolve(LoggerFactory).buildLogger(Task.name);
    public name: string;
    public timeout: number;
    public run: (client: Client) => Promise<void>;

    public static async waitTillReady(client: DiscordClient, checkAgainTime = 500) {
        Task.logger.debug(`${event("Waiting")} for ${classes("client")} to be ready.`);
        while (!client.isReady()) {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}
