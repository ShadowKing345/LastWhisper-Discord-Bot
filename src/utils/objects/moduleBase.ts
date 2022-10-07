import { Command } from "../models/command.js";
import { Listener } from "../models/listener.js";
import { Task } from "../models/task.js";
import { PermissionManagerService } from "../../services/permissionManager.service.js";

export abstract class ModuleBase {
    public moduleName = "";
    public commands: Command[] = [];
    public listeners: Listener[] = [];
    public tasks: Task[] = [];

    protected constructor(
        public permissionManagerService: PermissionManagerService,
    ) {
    }
}
