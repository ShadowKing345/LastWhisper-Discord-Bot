import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "./eventManager.service.js";
export declare class EventManagerModule extends ModuleBase {
    private eventManagerService;
    private static readonly commands;
    constructor(eventManagerService: EventManagerService);
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private reminderLoop;
    private listEvents;
    private onReady;
}
//# sourceMappingURL=eventManager.module.d.ts.map