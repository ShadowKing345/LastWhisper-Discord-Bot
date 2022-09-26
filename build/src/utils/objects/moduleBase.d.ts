import { Command } from "../models/command.js";
import { Listener } from "../models/listener.js";
import { Task } from "../models/task.js";
export declare abstract class ModuleBase {
    moduleName: string;
    commands: Command[];
    listeners: Listener[];
    tasks: Task[];
    protected constructor();
}
//# sourceMappingURL=moduleBase.d.ts.map