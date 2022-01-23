import {ClientEvents} from "discord.js";
import {Client} from "./client";

export class Listener {
    public event: keyof ClientEvents;
    public run: (client: Client, ...args) => Awaited<void>;
}