import {Command} from "./command";
import {Listener} from "./listener";
import {Task} from "./task";

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