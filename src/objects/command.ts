import {CommandInteraction} from "discord.js";

export class Command {
    public name: string = null;
    public description: string = null;

    public callback: <T extends CommandInteraction>(interaction: T) => Promise<unknown> | unknown = null;

    protected constructor(data: Partial<Command> = null) {
        if (data) {
            this.merge(data);
        }
    }

    public merge(obj: Partial<Command>): Command {
        if (obj.name) {
            this.name = obj.name;
        }

        if (obj.description) {
            this.description = obj.description;
        }

        if (obj.callback) {
            this.callback = obj.callback;
        }

        return this;
    }
}