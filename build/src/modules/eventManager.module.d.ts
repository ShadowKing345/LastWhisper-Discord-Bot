import { ModuleBase, EventListener, Task } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
import { pino } from "pino";
export declare class EventManagerModule extends ModuleBase {
    private eventManagerService;
    moduleName: string;
    commands: CommandBuilders;
    eventListeners: EventListener[];
    tasks: Task[];
    constructor(eventManagerService: EventManagerService, permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private reminderLoop;
    private listEvents;
    private onReady;
}
//# sourceMappingURL=eventManager.module.d.ts.map