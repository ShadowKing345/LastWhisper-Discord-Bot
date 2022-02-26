import {Command} from "./command.js";
import {Listener} from "./listener.js";
import {Task} from "./task.js";

export class ModuleBase {
    protected _moduleName = "";
    protected _command?: Command;
    protected _commands: Command[] = [];
    protected _listeners: Listener[] = [];
    protected _tasks: Task[] = [];

    get moduleName(): string {
        return this._moduleName;
    }

    get command(): Command {
        return this._command;
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