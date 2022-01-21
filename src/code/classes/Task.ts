import Client from "./Client";
import {Client as DiscordClient} from "discord.js";

export default class Task {
    name: string;
    timeout: number;
    run: (client: Client) => Promise<void>;

    constructor(name: string, timeout: number, run: (client: Client) => Promise<void>) {
        this.name = name;
        this.timeout = timeout;
        this.run = run;
    }

    static async waitTillReady(client: DiscordClient, checkAgainTime: number = 500) {
        while (!client.isReady)
            await new Promise(resolve => setTimeout(resolve, checkAgainTime));
    }
}