import { Command } from "./command.js";
import { Listener } from "./listener.js";
import { Task } from "./task.js";
export declare class ModuleBase {
    protected _moduleName: string;
    protected _commands: Command[];
    protected _listeners: Listener[];
    protected _tasks: Task[];
    constructor();
    get moduleName(): string;
    get commands(): Command[];
    get listeners(): Listener[];
    get tasks(): Task[];
}
