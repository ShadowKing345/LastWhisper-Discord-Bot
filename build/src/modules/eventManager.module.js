var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EventManagerModule_1;
import { ApplicationCommandOptionType } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilder, CommandBuilderOption } from "../utils/objects/commandBuilder.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
let EventManagerModule = EventManagerModule_1 = class EventManagerModule extends ModuleBase {
    eventManagerService;
    moduleName = "EventManager";
    commands = [
        new CommandBuilder({
            name: "event",
            description: "Displays events.",
            options: [
                new CommandBuilderOption({
                    name: "index",
                    description: "The index for the event, starting at 0.",
                    type: ApplicationCommandOptionType.Integer,
                }),
            ],
            execute: interaction => this.listEvents(interaction),
        }),
    ];
    listeners = [
        { event: "messageCreate", run: async (_, message) => this.createEvent(message) },
        { event: "messageUpdate", run: async (_, old, message) => this.updateEvent(old, message) },
        { event: "messageDelete", run: async (_, message) => await this.deleteEvent(message) },
        { event: "ready", run: async (client) => this.onReady(client) },
    ];
    tasks = [
        {
            name: `${this.moduleName}#postMessageTask`,
            timeout: 60000,
            run: client => this.reminderLoop(client),
        },
    ];
    constructor(eventManagerService, permissionManagerService, logger) {
        super(permissionManagerService, logger);
        this.eventManagerService = eventManagerService;
        console.log(this.commands[0].build().toJSON());
    }
    createEvent(message) {
        return this.eventManagerService.createEvent(message);
    }
    updateEvent(oldMessage, newMessage) {
        return this.eventManagerService.updateEvent(oldMessage, newMessage);
    }
    deleteEvent(message) {
        return this.eventManagerService.deleteEvent(message);
    }
    reminderLoop(client) {
        return this.eventManagerService.reminderLoop(client);
    }
    listEvents(interaction) {
        return this.eventManagerService.listEvents(interaction);
    }
    onReady(client) {
        return this.eventManagerService.onReady(client);
    }
};
EventManagerModule = EventManagerModule_1 = __decorate([
    registerModule(),
    __param(2, createLogger(EventManagerModule_1.name)),
    __metadata("design:paramtypes", [EventManagerService,
        PermissionManagerService, Object])
], EventManagerModule);
export { EventManagerModule };
//# sourceMappingURL=eventManager.module.js.map