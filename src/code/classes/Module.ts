import Command from "./Command";
import Listener from "./Listener";
import Task from "./Task";
import {BaseMessageComponent} from "discord.js";

export class Module {
    name: string;
    commands: Command[];
    listeners: Listener[];
    tasks: Task[];
    actions: BaseMessageComponent[]

    constructor(name?: string) {
        this.name = name;
        this.commands = [];
        this.listeners = [];
        this.tasks = [];

    }
}