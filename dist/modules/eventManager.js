var EventManagerModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { ModuleBase } from "../utils/models/index.js";
import { EventManagerService } from "../services/eventManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Command, CommandOption } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
import { EventListener } from "../utils/objects/eventListener.js";
import { EventObj } from "../models/event_manager/index.js";
import { WrongChannelError } from "../utils/errors/index.js";
import { DateTime } from "luxon";
import { registerModule, addPermissionKeys, authorize, deferReply } from "../utils/decorators/index.js";
let EventManagerModule = EventManagerModule_1 = class EventManagerModule extends ModuleBase {
    service;
    static permissionKeys = {
        create: "EventManager.create",
        update: "EventManager.update",
        cancel: "EventManager.cancel",
        test: "EventManager.test",
        list: "EventManager.list",
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
                            type: ApplicationCommandOptionType.String,
                        }),
                        new CommandOption({
                            name: "name",
                            description: "Name of event.",
                            type: ApplicationCommandOptionType.String,
                        }),
                        new CommandOption({
                            name: "description",
                            description: "Description of event.",
                            type: ApplicationCommandOptionType.String,
                        }),
                        new CommandOption({
                            name: "time",
                            description: "Time of event.",
                            type: ApplicationCommandOptionType.String,
                        }),
                    ],
                }),
                UpdateEvent: new Command({
                    name: "update",
                    description: "Updates event information with new one.",
                    options: [
                        new CommandOption({
                            name: "index",
                            description: "The index for the event, starting at 0.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }),
                        new CommandOption({
                            name: "text",
                            description: "The new message you want to use instead. (Will not update the exiting message)",
                            type: ApplicationCommandOptionType.String,
                        }),
                        new CommandOption({
                            name: "name",
                            description: "Name of event.",
                            type: ApplicationCommandOptionType.String,
                        }),
                        new CommandOption({
                            name: "description",
                            description: "Description of event.",
                            type: ApplicationCommandOptionType.String,
                        }),
                        new CommandOption({
                            name: "time",
                            description: "Time of event.",
                            type: ApplicationCommandOptionType.String,
                        }),
                    ],
                }),
                CancelEvent: new Command({
                    name: "cancel",
                    description: "Cancels an event. This is will effectively stop it.",
                    options: [
                        new CommandOption({
                            name: "index",
                            description: "The index for the event, starting at 0.",
                            type: ApplicationCommandOptionType.Integer,
                            required: true,
                        }),
                    ],
                }),
                TestEvent: new Command({
                    name: "test",
                    description: "Tests a given string with the event parser. Checking if it's valid and returning event details.",
                    options: [
                        new CommandOption({
                            name: "text",
                            description: "The message you wish to check against.",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        }),
                    ],
                }),
                ListEvent: new Command({
                    name: "list",
                    description: "Displays events.",
                    options: [
                        new CommandOption({
                            name: "index",
                            description: "The index for the event, starting at 0.",
                            type: ApplicationCommandOptionType.Integer,
                        }),
                    ],
                }),
            },
            execute: this.commandResolver.bind(this),
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
    commandResolverKeys = {
        "event_manager.create": this.createEventCommand.bind(this),
        "event_manager.update": this.updateEventCommand.bind(this),
        "event_manager.cancel": this.cancelEventCommand.bind(this),
        "event_manager.test": this.testEventCommand.bind(this),
        "event_manager.list": this.listEventCommand.bind(this),
    };
    constructor(service, permissionManagerService, logger) {
        super(permissionManagerService, logger);
        this.service = service;
    }
    async createEventCommand(interaction) {
        const name = interaction.options.getString("name");
        const description = interaction.options.getString("description");
        const time = interaction.options.getString("time");
        const text = interaction.options.getString("text") ?? (await this.service.createContent(interaction.guildId, name, description, time));
        const event = await this.service.create(interaction.guildId, null, text);
        await interaction.editReply({ content: event ? "Event was successfully created." : "Event failed to be created." });
    }
    async updateEventCommand(interaction) {
        const index = interaction.options.getNumber("index", true);
        const name = interaction.options.getString("name");
        const description = interaction.options.getString("description");
        const time = interaction.options.getString("time");
        const event = await this.service.updateByIndex(interaction.guildId, index, await this.service.createContent(interaction.guildId, name, description, time));
        await interaction.editReply({ content: event ? "Event was successfully updated." : "Event failed to be updated." });
    }
    async cancelEventCommand(interaction) {
        const index = interaction.options.getNumber("index", true);
        try {
            await this.service.cancelByIndex(interaction.guildId, index);
            await interaction.editReply({ content: "Event was successfully canceled." });
        }
        catch (error) {
            this.logger.error(error instanceof Error ? error.stack : error);
            await interaction.editReply({ content: "Event failed to be canceled." });
        }
    }
    async testEventCommand(interaction) {
        const event = await this.service.parseEvent(interaction.guildId, interaction.options.getString("text", true));
        await interaction.editReply({
            embeds: [
                new EmbedBuilder({
                    title: event.isValid ? "Event is valid." : "Event is not valid.",
                    fields: [
                        { name: "Name", value: event.name ?? "Name cannot be null." },
                        { name: "Description", value: event.description ?? "Description cannot be null." },
                        {
                            name: "Time",
                            value: event.dateTime
                                ? event.dateTime < DateTime.now().toUnixInteger()
                                    ? `<t:${event.dateTime}:F>`
                                    : "Time is before the present."
                                : "The format for the time was not correct. Use the Hammer time syntax to help.",
                        },
                        { name: "Additional", value: event.additional.map((pair) => `[${pair[0]}]\n${pair[1]}`).join("\n") },
                    ],
                }).setColor(event.isValid ? "Green" : "Red"),
            ],
        });
    }
    async listEventCommand(interaction) {
        const event = await this.service.findIndex(interaction.guildId, interaction.options.getInteger("index"));
        if (event == null) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder({
                        title: "No events were set.",
                        description: "There are currently no active events going on in your guild.",
                    }),
                ],
            });
            return;
        }
        const embed = event instanceof EventObj
            ? this.service.createEventEmbed(event)
            : new EmbedBuilder({
                title: "Upcoming Events",
                fields: event.map((event, index) => ({
                    name: `Index ${index}:`,
                    value: `${event.name}\n**Begins: <t:${event.dateTime}:R>**`,
                    inline: false,
                })),
            }).setColor("Random");
        await interaction.editReply({ embeds: [embed] });
    }
    async createEvent(message) {
        this.logger.debug("On Message Create fired. Creating new event.");
        if (message.partial)
            message = await message.fetch();
        if (message.author?.id === message.client?.application?.id || message.applicationId) {
            this.logger.debug("Author is an application and message is ignored.");
            return;
        }
        try {
            const event = await this.service.create(message.guildId, message.id, message.content, message.channelId);
            await message.react(event ? "✅" : "❎");
            this.logger.debug("New event created.");
        }
        catch (error) {
            if (error instanceof WrongChannelError) {
                this.logger.debug("Channel was wrong.");
                return;
            }
            this.logger.error(error instanceof Error ? error.stack : error);
            await message.react("❓");
        }
    }
    async updateEvent(oldMessage, newMessage) {
        if (oldMessage.partial)
            await oldMessage.fetch();
        if (newMessage.partial)
            await newMessage.fetch();
        if (newMessage.author?.id === newMessage.client?.application?.id || newMessage.applicationId) {
            this.logger.debug("Author is an application and message is ignored.");
            return;
        }
        if (!(await this.service.eventExists(oldMessage.guildId, oldMessage.id))) {
            return;
        }
        try {
            const event = await this.service.update(oldMessage.guildId, oldMessage.id, newMessage.content);
            const reaction = newMessage.reactions.cache.find((reaction) => reaction.me);
            if (reaction)
                await reaction.users.remove(oldMessage.client.user?.id);
            await newMessage.react(event ? "✅" : "❎");
        }
        catch (error) {
            this.logger.error(error instanceof Error ? error.stack : error);
            await newMessage.react("❓");
        }
    }
    async deleteEvent(message) {
        if (message.partial)
            message = await message.fetch();
        return this.service.cancel(message.guildId, message.id);
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
    deferReply(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "createEventCommand", null);
__decorate([
    authorize(EventManagerModule_1.permissionKeys.update),
    deferReply(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "updateEventCommand", null);
__decorate([
    authorize(EventManagerModule_1.permissionKeys.cancel),
    deferReply(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "cancelEventCommand", null);
__decorate([
    authorize(EventManagerModule_1.permissionKeys.test),
    deferReply(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], EventManagerModule.prototype, "testEventCommand", null);
__decorate([
    authorize(EventManagerModule_1.permissionKeys.list),
    deferReply(),
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
//# sourceMappingURL=eventManager.js.map