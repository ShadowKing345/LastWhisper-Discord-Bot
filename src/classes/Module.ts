import Command from "./Command";
import Listener from "./Listener";
import Task from "./Task";

export class Module {
    name: string;
    commands: Array<Command>;
    listeners: Array<Listener>;
    tasks: Array<Task>;

    constructor(name?: string) {
        this.name = name;
        this.commands = [];
        this.listeners = [];
        this.tasks = [];
    }
}