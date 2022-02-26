import { ModuleBase } from "../classes/moduleBase.js";
export declare class EventManagerModule extends ModuleBase {
    private service;
    constructor();
    private parseMessage;
    private getConfig;
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private static parseTriggerDuration;
    private reminderLoop;
    private event;
    private onReady;
}
