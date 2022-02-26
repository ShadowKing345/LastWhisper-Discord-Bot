import {Client} from "./client.js";
import {Client as DiscordClient} from "discord.js";

export class Task {
    public name: string;
    public timeout: number;
    public run: (client: Client) => Promise<void>;

    public static async waitTillReady(client: DiscordClient, checkAgainTime = 500) {
        while (!client.isReady())
        {
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
        }
    }
}