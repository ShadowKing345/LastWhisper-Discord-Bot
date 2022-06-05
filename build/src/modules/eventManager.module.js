var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import { ModuleBase } from "../classes/moduleBase.js";
import { EventManagerService } from "../services/eventManager.service.js";
let EventManagerModule = class EventManagerModule extends ModuleBase {
    eventManagerService;
    constructor(eventManagerService) {
        super();
        this.eventManagerService = eventManagerService;
        this.moduleName = "EventManager";
        this.commands = [
            {
                command: builder => builder
                    .setName("event")
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
                run: async (client) => await this.reminderLoop(client),
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
EventManagerModule = __decorate([
    injectable(),
    __metadata("design:paramtypes", [EventManagerService])
], EventManagerModule);
export { EventManagerModule };
//# sourceMappingURL=eventManager.module.js.map