var EventManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ChatInputCommandInteraction, ApplicationCommandOptionType } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { EventListener } from "../utils/objects/eventListener.js";
import { addPermissionKeys } from "../utils/decorators/addPermissionKeys.js";
import { authorize } from "../utils/decorators/authorize.js";
let EventManagerModule = EventManagerModule_1 = class EventManagerModule extends ModuleBase {
    service;
    static permissionKeys = {
        create: "EventManager.create",
        update: "EventManager.update",
        cancel: "EventManager.cancel",
        test: "EventManager.test",
        list: "EventManager.list"
    };
    moduleName = "EventManager";
    commands = [
        new Command({
            name: "event_manager",
            description: "Manages all things related to event planning.",
            subcommands: {
                CreateEvent: new Command({
                    name: "create",
                    description: "Creates a new event. Note no message will be posted only the data saved.",
                    options: [
                        new CommandOption({
                            name: "text",
                            description: "The new message you want to use instead. (Will not update the exiting message)",
                            type: ApplicationCommandOptionType.String
                        }),
                        new CommandOption({
                            name: "name",
                            description: "Name of event.",
                            type: ApplicationCommandOptionType.String
                        }),
                        new CommandOption({
                            name: "description",
                            description: "Description of event.",
                            type: ApplicationCommandOptionType.String
                        }),
                        new CommandOption({
                            name: "time",
                            description: "Time of event.",
                            type: ApplicationCommandOptionType.String
                        })
                    ]
                }),
                UpdateEvent: new Command({
                    name: "update",
                    description: "Updates event information with new one.",
                    options: [
                        new CommandOption({
                            name: "index",
                            description: "The index for the event, starting at 0.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true
                        }),
                        new CommandOption({
                            name: "text",
                            description: "The new message you want to use instead. (Will not update the exiting message)",
                            type: ApplicationCommandOptionType.String
                        }),
                        new CommandOption({
                            name: "name",
                            description: "Name of event.",
                            type: ApplicationCommandOptionType.String
                        }),
                        new CommandOption({
                            name: "description",
                            description: "Description of event.",
                            type: ApplicationCommandOptionType.String
                        }),
                        new CommandOption({
                            name: "time",
                            description: "Time of event.",
                            type: ApplicationCommandOptionType.String
                        })
                    ]
                }),
                CancelEvent: new Command({
                    name: "cancel",
                    description: "Cancels an event. This is will effectively stop it.",
                    options: [
                        new CommandOption({
                            name: "index",
                            description: "The index for the event, starting at 0.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true
                        })
                    ]
                }),
                TestEvent: new Command({
                    name: "test",
                    description: "Tests a given string with the event parser. Checking if it's valid and returning event details.",
                    options: [
                        new CommandOption({
                            name: "text",
                            description: "The message you wish to check against.",
                            type: ApplicationCommandOptionType.String,
                            required: true
                        })
                    ]
                }),
                ListEvent: new Command({
                    name: "list",
                    description: "Displays events.",
                    options: [
                        new CommandOption({
                            name: "index",
                            description: "The index for the event, starting at 0.",
                            type: ApplicationCommandOptionType.Integer
                        })
                    ]
                })
            },
            execute: this.commandResolver.bind(this)
        })
    ];
    eventListeners = [
        new EventListener("messageCreate", (_, [message]) => this.createEvent(message)),
        new EventListener("messageUpdate", (_, [old, message]) => this.updateEvent(old, message)),
        new EventListener("messageDelete", (_, [message]) => this.deleteEvent(message)),
        new EventListener("ready", (client) => this.onReady(client))
    ];
    timers = [
        {
            name: `${this.moduleName}#postMessageTask`,
            timeout: 60000,
            execute: (client) => this.reminderLoop(client)
        }
    ];
    commandResolverKeys = {
        "event_manager.create": this.createEventCommand.bind(this),
        "event_manager.update": this.updateEventCommand.bind(this),
        "event_manager.cancel": this.cancelEventCommand.bind(this),
        "event_manager.test": this.testEventCommand.bind(this),
        "event_manager.list": this.listEventCommand.bind(this)
    };
    constructor(service, permissionManagerService, logger) {
        super(permissionManagerService, logger);
        this.service = service;
    }
    createEventCommand(interaction) {
        return this.service.createEventCommand(interaction);
    }
    updateEventCommand(interaction) {
        return this.service.updateEventCommand(interaction);
    }
    cancelEventCommand(interaction) {
        return this.service.cancelEventCommand(interaction);
    }
    testEventCommand(interaction) {
        return this.service.testEventCommand(interaction);
    }
    listEventCommand(interaction) {
        return this.service.listEventCommand(interaction);
    }
    createEvent(message) {
        return this.service.createEvent(message);
    }
    updateEvent(oldMessage, newMessage) {
        return this.service.updateEvent(oldMessage, newMessage);
    }
    deleteEvent(message) {
        return this.service.deleteEvent(message);
    }
    onReady(client) {
        return this.service.onReady(client);
    }
    reminderLoop(client) {
        return this.service.reminderLoop(client);
    }
};
__decorate([
    authorize(EventManagerModule_1.permissionKeys.create),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "createEventCommand", null);
__decorate([
    authorize(EventManagerModule_1.permissionKeys.update),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "updateEventCommand", null);
__decorate([
    authorize(EventManagerModule_1.permissionKeys.cancel),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "cancelEventCommand", null);
__decorate([
    authorize(EventManagerModule_1.permissionKeys.test),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "testEventCommand", null);
__decorate([
    authorize(EventManagerModule_1.permissionKeys.list),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "listEventCommand", null);
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