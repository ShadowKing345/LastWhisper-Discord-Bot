import { PermissionManagerService } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { EventManagerService } from "./eventManager.service.js";
export declare class EventManagerModule extends ModuleBase {
    private eventManagerService;
    private permissionManager;
    private static readonly commands;
    constructor(eventManagerService: EventManagerService, permissionManager: PermissionManagerService);
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private reminderLoop;
    private listEvents;
    private onReady;
}
//# sourceMappingURL=eventManager.module.d.ts.map