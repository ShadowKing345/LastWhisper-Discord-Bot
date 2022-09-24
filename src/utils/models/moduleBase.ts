import { Command } from "./command.js";
import { Listener } from "./listener.js";
import { Task } from "./task.js";

export class ModuleBase {
    public moduleName = "";
    public commands: Command[] = [];
    public listeners: Listener[] = [];
    public tasks: Task[] = [];
}
