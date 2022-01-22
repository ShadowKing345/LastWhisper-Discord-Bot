import {ClientEvents} from "discord.js";

export class Listener {
    public event: Exclude<string | symbol, keyof ClientEvents>;
    public run: (...args) => void;
}