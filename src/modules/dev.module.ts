import { registerModule } from "../utils/decorators/registerModule.js";
import { ModuleBase } from "../utils/objects/moduleBase.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandInteraction, SelectMenuBuilder, ButtonStyle, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChatInputCommandInteraction, ModalActionRowComponentBuilder, InteractionResponse, ButtonInteraction } from "discord.js";
import { CommandBuilders, CommandBuilder } from "../utils/objects/commandBuilder.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";

@registerModule()
export class DevModule extends ModuleBase {
    public moduleName: string = "DevModule";
    public commands: CommandBuilders = [
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

    public buttons = {
        buttonTest1: (interaction) => this.buttonTest(interaction),
    };

    public constructor(
        permissionManagerService: PermissionManagerService,
        @createLogger(DevModule.name) logger: pino.Logger,
    ) {
        super(permissionManagerService, logger);
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

    private async buttonTest(interaction: ChatInputCommandInteraction): Promise<void | InteractionResponse> {
        await interaction.reply({
            content: `${interaction.member.avatar} has clicked button ${interaction.commandName} ${(interaction as unknown as ButtonInteraction).customId}.`,
            ephemeral: true,
        });
    }
}