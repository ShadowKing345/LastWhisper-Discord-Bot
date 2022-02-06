import {Command} from "./command.js";
import {Listener} from "./listener.js";
import {Task} from "./task.js";

export class ModuleBase {
    protected _moduleName: string = "";
    protected _commands: Command[] = [];
    protected _listeners: Listener[] = [];
    protected _tasks: Task[] = [];

    constructor() {
    }

    get moduleName(): string {
        return this._moduleName;
    }

    get commands(): Command[] {
        return this._commands;
    }

    get listeners(): Listener[] {
        return this._listeners;
    }

    get tasks(): Task[] {
        return this._tasks;
    }
}