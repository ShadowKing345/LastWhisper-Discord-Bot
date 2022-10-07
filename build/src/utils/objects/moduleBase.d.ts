import { Command } from "../models/command.js";
import { Listener } from "../models/listener.js";
import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
/**
 * Base class for a module.
 */
export declare abstract class ModuleBase {
    permissionManagerService: PermissionManagerService;
    moduleName: string;
    commands: Command[];
    listeners: Listener[];
    tasks: Task[];
    protected constructor(permissionManagerService: PermissionManagerService);
}
//# sourceMappingURL=moduleBase.d.ts.map