import { module } from "../decorators/index.js";
import { Module } from "./module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  CommandInteraction,
  InteractionResponse,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Logger } from "../config/logger.js";
import { Command } from "../decorators/command.js";
import { SlashCommand, SlashCommands } from "../objects/index.js";

/**
 * Development module used for testing features and random things.
 */
@module()
export class DevModule extends Module {
  protected logger: Logger = new Logger(DevModule);

  public moduleName = "DevModule";
  public commands: SlashCommands = [
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

  public buttons = {
    buttonTest1: (interaction: ChatInputCommandInteraction) => this.buttonTest(interaction),
  };

  public constructor(
    permissionManagerService: PermissionManagerService,
  ) {
    super(permissionManagerService);
  }

  private async testInteractionTypes(interaction: CommandInteraction): Promise<void> {
    const button = new ButtonBuilder().setCustomId("buttonTest1").setLabel("click me").setStyle(ButtonStyle.Danger);

    const select = new SelectMenuBuilder().setCustomId("selectTest1").setPlaceholder("Nothing selected").addOptions(
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
    const modal = new ModalBuilder().setCustomId("TestModal1").setTitle("Test Modal");

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
      content: `${interaction.member?.avatar ?? "No avatar set"} has clicked button ${interaction.commandName} ${
        (interaction as unknown as ButtonInteraction).customId
      }.`,
      ephemeral: true,
    });
  }
}
