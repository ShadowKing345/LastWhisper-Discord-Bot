import { Command } from "./command.js";
import { Listener } from "./listener.js";
import { Task } from "./task.js";
export declare class ModuleBase {
    protected _moduleName: string;
    protected _command?: Command;
    protected _commands: Command[];
    protected _listeners: Listener[];
    protected _tasks: Task[];
    constructor();
    get moduleName(): string;
    get command(): Command;
    get commands(): Command[];
    get listeners(): Listener[];
    get tasks(): Task[];
}
