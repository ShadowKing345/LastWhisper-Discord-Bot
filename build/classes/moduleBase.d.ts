import { Command } from "./command.js";
import { Listener } from "./listener.js";
import { Task } from "./task.js";
export declare class ModuleBase {
    moduleName: string;
    commands: Command[];
    listeners: Listener[];
    tasks: Task[];
}
