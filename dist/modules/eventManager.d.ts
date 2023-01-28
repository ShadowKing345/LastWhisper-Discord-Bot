import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "./module.js";
import { EventManagerService } from "../services/eventManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { SlashCommands } from "../objects/slashCommand.js";
import { EventListeners } from "../objects/index.js";
import { Timers } from "../objects/timer.js";
import { Logger } from "../config/logger.js";
export declare class EventManagerModule extends Module {
    private service;
    protected logger: Logger;
    static permissionKeys: {
        create: string;
        update: string;
        cancel: string;
        test: string;
        list: string;
    };
    moduleName: string;
    commands: SlashCommands;
    eventListeners: EventListeners;
    timers: Timers;
    protected commandResolverKeys: {
        "event_manager.create": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "event_manager.update": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "event_manager.cancel": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "event_manager.test": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "event_manager.list": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(service: EventManagerService, permissionManagerService: PermissionManagerService);
    private createEventCommand;
    private updateEventCommand;
    private cancelEventCommand;
    private testEventCommand;
    private listEventCommand;
    private createEvent;
    private updateEvent;
    private deleteEvent;
    private onReady;
    private reminderLoop;
}
//# sourceMappingURL=eventManager.d.ts.map