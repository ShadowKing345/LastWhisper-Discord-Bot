import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
import { EventListener } from "../models/index.js";
import { CommandBuilders } from "./commandBuilder.js";
/**
 * Base class for a module.
 */
export declare abstract class ModuleBase {
    permissionManagerService: PermissionManagerService;
    moduleName: string;
    commands: CommandBuilders;
    listeners: EventListener[];
    tasks: Task[];
    protected constructor(permissionManagerService: PermissionManagerService);
}
//# sourceMappingURL=moduleBase.d.ts.map