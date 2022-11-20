var DevModule_1;
import { __decorate, __metadata, __param } from "tslib";
import { module } from "../utils/decorators/index.js";
import { Module } from "../utils/objects/module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { SelectMenuBuilder, ButtonStyle, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, } from "discord.js";
import { Command } from "../utils/objects/command.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";
let DevModule = DevModule_1 = class DevModule extends Module {
    moduleName = "DevModule";
    commands = [
        new Command({
            name: "test_inputs",
            description: "Testing command.",
            execute: interaction => this.testInteractionTypes(interaction),
        }),
        new Command({
            name: "test_modal",
            description: "Testing command.",
            execute: interaction => this.testModal(interaction),
        }),
    ];
    buttons = {
        buttonTest1: (interaction) => this.buttonTest(interaction),
    };
    constructor(permissionManagerService, logger) {
        super(permissionManagerService, logger);
    }
    async testInteractionTypes(interaction) {
        const button = new ButtonBuilder().setCustomId("buttonTest1").setLabel("click me").setStyle(ButtonStyle.Danger);
        const select = new SelectMenuBuilder().setCustomId("selectTest1").setPlaceholder("Nothing selected").addOptions({
            label: "Select me",
            description: "This is a description",
            value: "first_option",
        }, {
            label: "You can select me too",
            description: "This is also a description",
            value: "second_option",
        });
        await interaction.reply({
            fetchReply: true,
            content: "Testing text",
            components: [
                new ActionRowBuilder().setComponents(button),
                new ActionRowBuilder().setComponents(select),
            ],
        });
    }
    async testModal(interaction) {
        const modal = new ModalBuilder().setCustomId("TestModal1").setTitle("Test Modal");
        const favoriteColorInput = new TextInputBuilder()
            .setCustomId("favoriteColorInput")
            .setLabel("What's your favorite color?")
            .setStyle(TextInputStyle.Short);
        const hobbiesInput = new TextInputBuilder()
            .setCustomId("hobbiesInput")
            .setLabel("What's some of your favorite hobbies?")
            .setStyle(TextInputStyle.Paragraph);
        const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
        modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal);
    }
    async buttonTest(interaction) {
        await interaction.reply({
            content: `${interaction.member?.avatar ?? "No avatar set"} has clicked button ${interaction.commandName} ${interaction.customId}.`,
            ephemeral: true,
        });
    }
};
DevModule = DevModule_1 = __decorate([
    module(),
    __param(1, createLogger(DevModule_1.name)),
    __metadata("design:paramtypes", [PermissionManagerService, Object])
], DevModule);
export { DevModule };
//# sourceMappingURL=dev.js.map