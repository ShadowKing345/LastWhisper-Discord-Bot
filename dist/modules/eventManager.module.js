var EventManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ApplicationCommandOptionType, } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { EventListener, } from "../utils/objects/eventListener.js";
import { addPermissionKeys } from "../utils/decorators/addPermissionKeys.js";
let EventManagerModule = EventManagerModule_1 = class EventManagerModule extends ModuleBase {
    eventManagerService;
    static permissionKeys = {
        Event: "EventManager.event",
    };
    moduleName = "EventManager";
    commands = [
        new Command({
            name: "event",
            description: "Displays events.",
            options: [
                new CommandOption({
                    name: "index",
                    description: "The index for the event, starting at 0.",
                    type: ApplicationCommandOptionType.Integer,
                }),
            ],
            execute: (interaction) => this.listEvents(interaction),
        }),
    ];
    eventListeners = [
        new EventListener("messageCreate", (_, [message]) => this.createEvent(message)),
        new EventListener("messageUpdate", (_, [old, message]) => this.updateEvent(old, message)),
        new EventListener("messageDelete", (_, [message]) => this.deleteEvent(message)),
        new EventListener("ready", (client) => this.onReady(client)),
    ];
    timers = [
        {
            name: `${this.moduleName}#postMessageTask`,
            timeout: 60000,
            execute: (client) => this.reminderLoop(client),
        },
    ];
    constructor(eventManagerService, permissionManagerService, logger) {
        super(permissionManagerService, logger);
        this.eventManagerService = eventManagerService;
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
__decorate([
    addPermissionKeys(),
    __metadata("design:type", Object)
], EventManagerModule, "permissionKeys", void 0);
EventManagerModule = EventManagerModule_1 = __decorate([
    registerModule(),
    __param(2, createLogger(EventManagerModule_1.name)),
    __metadata("design:paramtypes", [EventManagerService,
        PermissionManagerService, Object])
], EventManagerModule);
export { EventManagerModule };
//# sourceMappingURL=eventManager.module.js.map