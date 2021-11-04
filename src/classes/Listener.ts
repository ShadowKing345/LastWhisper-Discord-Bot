import {ClientEvents} from "discord.js";

export default class Listener {
    name: string;
    event: Exclude<string | symbol, keyof ClientEvents>;
    run: (...args) => void;

    constructor(name: string, event: Exclude<string | symbol, keyof ClientEvents>, run: (...args) => void) {
        this.name = name;
        this.event = event;
        this.run = run;
    }
}