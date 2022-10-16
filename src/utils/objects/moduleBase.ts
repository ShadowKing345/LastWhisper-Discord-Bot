import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
import { ChatInputCommand, EventListener } from "../models/index.js";

/**
 * Base class for a module.
 */
export abstract class ModuleBase {
    public moduleName = "";
    public commands: ChatInputCommand[] = [];
    public listeners: EventListener[] = [];
    public tasks: Task[] = [];

    protected constructor(
        public permissionManagerService: PermissionManagerService,
    ) {
    }
}
