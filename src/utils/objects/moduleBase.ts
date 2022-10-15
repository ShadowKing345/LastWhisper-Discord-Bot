import { ChatCommand } from "../models/index.js";
import { Listener } from "../models/listener.js";
import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";

/**
 * Base class for a module.
 */
export abstract class ModuleBase {
    public moduleName = "";
    public commands: ChatCommand[] = [];
    public listeners: Listener[] = [];
    public tasks: Task[] = [];

    protected constructor(
        public permissionManagerService: PermissionManagerService,
    ) {
    }
}
