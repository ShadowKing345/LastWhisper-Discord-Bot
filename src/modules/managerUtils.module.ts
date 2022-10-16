import { GuildBan, GuildMember, ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { ModuleBase, EventListener } from "../utils/models/index.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilder, CommandBuilderOption, CommandBuilders } from "../utils/objects/commandBuilder.js";

@registerModule()
export class ManagerUtilsModule extends ModuleBase {

    public moduleName: string = "ManagerUtils";
    public commands: CommandBuilders = [ new CommandBuilder({
        name: "manager_utils",
        description: "Utility functions for managers.",
        subcommands: {
            Clear: {
                name: "clear",
                description: "Clears a channel of its messages.",
                options: [
                    new CommandBuilderOption({
                        name: "amount",
                        description: "The amount of messages to clear. Default 10.",
                    }),
                ],
            },
        },
        execute: interaction => this.subcommandResolver(interaction as ChatInputCommandInteraction),
    }) ];
    public listeners: EventListener[] = [
        { event: "guildBanAdd", run: async (_, member) => await this.onMemberBanned(member) },
        { event: "guildMemberRemove", run: async (client, member) => await this.onMemberRemoved(member) },
    ];

    constructor(
        private managerUtilsService: ManagerUtilsService,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService);
    }

    private onMemberRemoved(member: GuildMember): Promise<void> {
        return this.managerUtilsService.onMemberRemoved(member);
    }

    private onMemberBanned(ban: GuildBan): Promise<void> {
        return this.managerUtilsService.onMemberBanned(ban);
    }

    private async subcommandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void> {
        // if (!interaction.guildId) {
        //     return interaction.reply({
        //         content: "Sorry you cannot use this command outside of a server.",
        //         ephemeral: true,
        //     });
        // }
        //
        // const subcommand = interaction.options.getSubcommand();
        // if (!subcommand || subcommand !== ManagerUtilsModule.commands.Clear) {
        //     return interaction.reply({
        //         content: "Cannot find subcommand.",
        //         ephemeral: true,
        //     });
        // }
        //
        // return this.clearChannelMessages(interaction);
    }

    private clearChannelMessages(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.managerUtilsService.clearChannelMessages(interaction);
    }
}
