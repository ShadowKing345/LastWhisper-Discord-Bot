import { ModuleBase } from "../classes/moduleBase.js";
import { EventManagerService } from "../services/eventManager.service.js";
export declare class EventManagerModule extends ModuleBase {
    private eventManagerService;
    constructor(eventManagerService: EventManagerService);
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private reminderLoop;
    private listEvents;
    private onReady;
}
//# sourceMappingURL=eventManager.module.d.ts.map