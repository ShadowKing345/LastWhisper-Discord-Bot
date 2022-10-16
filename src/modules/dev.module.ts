import { registerModule } from "../utils/decorators/registerModule.js";
import { ModuleBase } from "../utils/objects/moduleBase.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandInteraction, SelectMenuBuilder, ButtonStyle, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChatInputCommandInteraction, ModalActionRowComponentBuilder } from "discord.js";

@registerModule()
export class DevModule extends ModuleBase {
    public constructor(permissionManagerService: PermissionManagerService) {
        super(permissionManagerService);

        this.moduleName = "Dev";
        this.commands = [
            {
                command: (builder) => builder.setName("test_inputs").setDescription("Testing command."),
                execute: async (interaction) => this.testInteractionTypes(interaction),
            },
            {
                command: (builder) => builder.setName("test_modal").setDescription("Testing command."),
                execute: async (interaction) => this.testModal(interaction as ChatInputCommandInteraction),
            },
        ];
    }

    private async testInteractionTypes(interaction: CommandInteraction): Promise<void> {
        const button = new ButtonBuilder()
            .setCustomId("buttonTest1")
            .setLabel("click me")
            .setStyle(ButtonStyle.Danger);

        const select = new SelectMenuBuilder()
            .setCustomId("selectTest1")
            .setPlaceholder("Nothing selected")
            .addOptions(
                {
                    label: "Select me",
                    description: "This is a description",
                    value: "first_option",
                },
                {
                    label: "You can select me too",
                    description: "This is also a description",
                    value: "second_option",
                },
            );

        await interaction.reply({
            fetchReply: true,
            content: "Testing text",
            components: [
                new ActionRowBuilder<ButtonBuilder>().setComponents(button),
                new ActionRowBuilder<SelectMenuBuilder>().setComponents(select),
            ],
        });
    }

    private async testModal(interaction: ChatInputCommandInteraction) {
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

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(favoriteColorInput);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput);

        modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal);
    }
}