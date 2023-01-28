import { module } from "../decorators/index.js";
import { Module } from "./module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  CommandInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Logger } from "../config/logger.js";
import { Command } from "../decorators/command.js";
import { SlashCommand } from "../objects/index.js";

/**
 * Development module used for testing features and random things.
 */
@module()
export class DevModule extends Module {
  protected logger: Logger = new Logger(DevModule);

  public moduleName = "DevModule";

  public constructor(
    permissionManagerService: PermissionManagerService,
  ) {
    super(permissionManagerService);
  }

  @Command({
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
  })
  public async subcommandResolverTest(interaction: ChatInputCommandInteraction): Promise<unknown> {
    switch (interaction.options.getSubcommand()) {
      case "ping":
        return interaction.reply("pong");
      case "pong":
        return interaction.reply("ping");
      default:
        return interaction.reply("what?");
    }
  }

  @Command({
    name: "slash_command_test",
    description: "Tests the slash command system. Returns all values placed.",
    options: [],
  })
  public async testChatInteractionFunction(interaction: ChatInputCommandInteraction): Promise<unknown> {
    return interaction.reply({ content: "Hello World" });
  }

  @Command({
    name: "test_inputs",
    description: "Testing command.",
  })
  public async testInteractionTypes(interaction: CommandInteraction): Promise<unknown> {
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

    return interaction.reply({
      fetchReply: true,
      content: "Testing text",
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(button),
        new ActionRowBuilder<SelectMenuBuilder>().setComponents(select),
      ],
    });
  }

  @Command({
    name: "test_modal",
    description: "Testing command.",
  })
  public async testModal(interaction: ChatInputCommandInteraction): Promise<unknown> {
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
    return interaction.showModal(modal);
  }
}
