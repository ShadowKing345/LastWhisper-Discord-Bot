import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";
import { EventListener } from "../models/index.js";
import { CommandBuilders } from "./commandBuilder.js";

/**
 * Base class for a module.
 */
export abstract class ModuleBase {
    public moduleName = "";
    public commands: CommandBuilders = [];
    public listeners: EventListener[] = [];
    public tasks: Task[] = [];

    protected constructor(
        public permissionManagerService: PermissionManagerService,
    ) {
    }
}
