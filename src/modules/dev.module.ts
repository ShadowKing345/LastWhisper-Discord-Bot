import { registerModule } from "../utils/decorators/registerModule.js";
import { ModuleBase } from "../utils/objects/moduleBase.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } from "discord.js";

@registerModule()
export class DevModule extends ModuleBase {
    public constructor(permissionManagerService: PermissionManagerService) {
        super(permissionManagerService);

        this.moduleName = "Dev";
        this.commands = [
            {
                command: (builder) => builder,
                run: async (interaction) => this.testInteractionTypes(interaction)
            }
        ]
    }

    private async testInteractionTypes(interaction: CommandInteraction): Promise<void> {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("ButtonTest1")
                    .setLabel("click me")
                    .setStyle(ButtonStyle.Danger),
                new SelectMenuBuilder()
                    .setCustomId('select')
                    .setPlaceholder('Nothing selected')
                    .addOptions(
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ),
            );


        await interaction.reply({
            content: "Testing text",
            // @ts-ignore
            components: [ row ],
        });
    }
}