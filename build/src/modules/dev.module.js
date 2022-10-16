var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { registerModule } from "../utils/decorators/registerModule.js";
import { ModuleBase } from "../utils/objects/moduleBase.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { SelectMenuBuilder, ButtonStyle, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";
import { CommandBuilder } from "../utils/objects/commandBuilder.js";
let DevModule = class DevModule extends ModuleBase {
    moduleName = "DevModule";
    commands = [
        new CommandBuilder({
            name: "test_inputs",
            description: "Testing command.",
            execute: interaction => this.testInteractionTypes(interaction),
        }),
        new CommandBuilder({
            name: "test_modal",
            description: "Testing command.",
            execute: interaction => this.testModal(interaction),
        }),
    ];
    constructor(permissionManagerService) {
        super(permissionManagerService);
    }
    async testInteractionTypes(interaction) {
        const button = new ButtonBuilder()
            .setCustomId("buttonTest1")
            .setLabel("click me")
            .setStyle(ButtonStyle.Danger);
        const select = new SelectMenuBuilder()
            .setCustomId("selectTest1")
            .setPlaceholder("Nothing selected")
            .addOptions({
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
        const modal = new ModalBuilder()
            .setCustomId("TestModal1")
            .setTitle("Test Modal");
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
};
DevModule = __decorate([
    registerModule(),
    __metadata("design:paramtypes", [PermissionManagerService])
], DevModule);
export { DevModule };
//# sourceMappingURL=dev.module.js.map