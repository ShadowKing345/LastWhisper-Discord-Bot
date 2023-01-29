var DevModule_1;
import { __decorate, __metadata } from "tslib";
import { module } from "../decorators/index.js";
import { Module } from "./module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, ModalBuilder, SelectMenuBuilder, TextInputBuilder, TextInputStyle, } from "discord.js";
import { Logger } from "../config/logger.js";
import { Command } from "../decorators/command.js";
import { SlashCommand } from "../objects/index.js";
let DevModule = DevModule_1 = class DevModule extends Module {
    logger = new Logger(DevModule_1);
    static moduleName = "DevModule";
    constructor(permissionManagerService) {
        super(permissionManagerService);
    }
    async subcommandResolverTest(interaction) {
        switch (interaction.options.getSubcommand()) {
            case "ping":
                return interaction.reply("pong");
            case "pong":
                return interaction.reply("ping");
            default:
                return interaction.reply("what?");
        }
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
        return interaction.reply({
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
        return interaction.showModal(modal);
    }
};
__decorate([
    Command({
        name: "slash_command_subcommand_test",
        description: "Tests if subcommands are working.",
        subcommands: {
            ping: new SlashCommand({
                name: "ping",
                description: "Returns pong.",
            }),
            pong: new SlashCommand({
                name: "pong",
                description: "Returns ping.",
            }),
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], DevModule.prototype, "subcommandResolverTest", null);
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
__decorate([
    Command({
        name: "test_inputs",
        description: "Testing command.",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], DevModule.prototype, "testInteractionTypes", null);
__decorate([
    Command({
        name: "test_modal",
        description: "Testing command.",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatInputCommandInteraction]),
    __metadata("design:returntype", Promise)
], DevModule.prototype, "testModal", null);
DevModule = DevModule_1 = __decorate([
    module(),
    __metadata("design:paramtypes", [PermissionManagerService])
], DevModule);
export { DevModule };
//# sourceMappingURL=dev.js.map