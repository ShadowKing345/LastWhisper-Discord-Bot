import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
export declare class EventManagerModule extends ModuleBase {
    private eventManagerService;
    private static readonly commands;
    constructor(eventManagerService: EventManagerService, permissionManagerService: PermissionManagerService);
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private reminderLoop;
    private listEvents;
    private onReady;
}
//# sourceMappingURL=eventManager.module.d.ts.map