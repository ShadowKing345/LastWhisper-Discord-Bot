var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventManagerModule_1;
import { CommandInteraction } from "discord.js";
import { singleton } from "tsyringe";
import { addCommandKeys, authorize } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { EventManagerService } from "./eventManager.service.js";
let EventManagerModule = EventManagerModule_1 = class EventManagerModule extends ModuleBase {
    eventManagerService;
    static commands = "event";
    constructor(eventManagerService) {
        super();
        this.eventManagerService = eventManagerService;
        this.moduleName = "EventManager";
        this.commands = [
            {
                command: builder => builder
                    .setName(EventManagerModule_1.commands)
                    .setDescription("Displays events.")
                    .addIntegerOption(option => option.setName("index").setDescription("The index for the event, starting at 0")),
                run: async (interaction) => this.listEvents(interaction),
            },
        ];
        this.listeners = [
            { event: "messageCreate", run: async (_, message) => this.createEvent(message) },
            { event: "messageUpdate", run: async (_, old, message) => this.updateEvent(old, message) },
            { event: "messageDelete", run: async (_, message) => await this.deleteEvent(message) },
            { event: "ready", run: async (client) => this.onReady(client) },
        ];
        this.tasks = [
            {
                name: `${this.moduleName}#postMessageTask`,
                timeout: 60000,
                run: client => this.reminderLoop(client),
            },
        ];
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
    authorize(EventManagerModule_1.commands),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "listEvents", null);
__decorate([
    addCommandKeys(),
    __metadata("design:type", String)
], EventManagerModule, "commands", void 0);
EventManagerModule = EventManagerModule_1 = __decorate([
    singleton(),
    __metadata("design:paramtypes", [EventManagerService])
], EventManagerModule);
export { EventManagerModule };
//# sourceMappingURL=eventManager.module.js.map