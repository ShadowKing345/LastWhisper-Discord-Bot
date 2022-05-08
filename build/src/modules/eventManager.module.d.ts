import { ModuleBase } from "../classes/moduleBase.js";
import { EventManagerConfigService } from "../services/eventManagerConfig.service.js";
export declare class EventManagerModule extends ModuleBase {
    private service;
    constructor(service: EventManagerConfigService);
    private static parseTriggerDuration;
    private parseMessage;
    private getConfig;
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private reminderLoop;
    private event;
    private onReady;
}
//# sourceMappingURL=eventManager.module.d.ts.map