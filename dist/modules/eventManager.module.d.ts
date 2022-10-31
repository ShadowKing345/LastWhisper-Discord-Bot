import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
import { EventListeners } from "../utils/objects/eventListener.js";
import { Timers } from "../utils/objects/timer.js";
export declare class EventManagerModule extends ModuleBase {
    private eventManagerService;
    static permissionKeys: {
        Event: string;
    };
    moduleName: string;
    commands: Commands;
    eventListeners: EventListeners;
    timers: Timers;
    constructor(eventManagerService: EventManagerService, permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private reminderLoop;
    private listEvents;
    private onReady;
}
//# sourceMappingURL=eventManager.module.d.ts.map