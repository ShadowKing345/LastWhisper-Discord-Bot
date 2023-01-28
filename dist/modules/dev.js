var DevModule_1;
import { __decorate, __metadata } from "tslib";
import { module } from "../decorators/index.js";
import { Module } from "./module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ModalBuilder, SelectMenuBuilder, TextInputBuilder, TextInputStyle, } from "discord.js";
import { Logger } from "../config/logger.js";
import { Command } from "../decorators/command.js";
import { SlashCommand } from "../objects/index.js";
let DevModule = DevModule_1 = class DevModule extends Module {
    logger = new Logger(DevModule_1);
    moduleName = "DevModule";
    commands = [
        new SlashCommand({
            name: "slash_command_subcommand_test",
            description: "Tests if subcommands are working.",
            subcommands: {
                ping: new SlashCommand({
                    name: "pong",
                    description: "Returns ping.",
                }),
            },
            callback: interaction => interaction.reply({ content: "ping" }),
        }),
        new SlashCommand({
            name: "test_inputs",
            description: "Testing command.",
            callback: interaction => this.testInteractionTypes(interaction),
        }),
        new SlashCommand({
            name: "test_modal",
            description: "Testing command.",
            callback: interaction => this.testModal(interaction),
        }),
    ];
    buttons = {
        buttonTest1: (interaction) => this.buttonTest(interaction),
    };
    constructor(permissionManagerService) {
        super(permissionManagerService);
    }
    async testChatInteractionFunction(interaction) {
        return interaction.reply({ content: "Hello World" });
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
__decorate([
    Command({
        name: "slash_command_test",
        description: "Tests the slash command system. Returns all values placed.",
        options: [],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], DevModule.prototype, "testChatInteractionFunction", null);
DevModule = DevModule_1 = __decorate([
    module(),
    __metadata("design:paramtypes", [PermissionManagerService])
], DevModule);
export { DevModule };
//# sourceMappingURL=dev.js.map