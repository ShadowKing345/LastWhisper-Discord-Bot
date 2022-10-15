import { GuildBan, GuildMember, ChatInputCommandInteraction, InteractionResponse } from "discord.js";

import { addCommandKeys } from "../utils/decorators/addCommandKeys.js";
import { authorize } from "../utils/decorators/authorize.js";
import { ModuleBase } from "../utils/models/index.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";

@registerModule()
export class ManagerUtilsModule extends ModuleBase {

    @addCommandKeys()
    private static readonly commands = {
        $index: "manager_utils",
        Clear: "clear",
    };

    constructor(
        private managerUtilsService: ManagerUtilsService,
        permissionManagerService: PermissionManagerService,
    ) {
        super(permissionManagerService);

        this.moduleName = "ManagerUtils";
        this.commands = [ {
            command: builder => builder
                .setName(ManagerUtilsModule.commands.$index)
                .setDescription("Utility functions for managers.")
                .addSubcommand(subcommandGroup => subcommandGroup
                    .setName(ManagerUtilsModule.commands.Clear)
                    .setDescription("Clears a channel of its messages.")
                    .addNumberOption(option => option
                        .setName("amount")
                        .setDescription("The amount of messages to clear. Default 10.")
                        .setRequired(false),
                    ),
                ),
            run: interaction => this.subcommandResolver(interaction as ChatInputCommandInteraction),
        } ];
        this.listeners = [
            { event: "guildBanAdd", run: async (_, member) => await this.onMemberBanned(member) },
            { event: "guildMemberRemove", run: async (client, member) => await this.onMemberRemoved(member) },
        ];
    }

    private onMemberRemoved(member: GuildMember): Promise<void> {
        return this.managerUtilsService.onMemberRemoved(member);
    }

    private onMemberBanned(ban: GuildBan): Promise<void> {
        return this.managerUtilsService.onMemberBanned(ban);
    }

    private subcommandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        if (!interaction.guildId) {
            return interaction.reply({
                content: "Sorry you cannot use this command outside of a server.",
                ephemeral: true,
            });
        }

        const subcommand = interaction.options.getSubcommand();
        if (!subcommand || subcommand !== ManagerUtilsModule.commands.Clear) {
            return interaction.reply({
                content: "Cannot find subcommand.",
                ephemeral: true,
            });
        }

        return this.clearChannelMessages(interaction);
    }

    @authorize(ManagerUtilsModule.commands.$index, ManagerUtilsModule.commands.Clear)
    private clearChannelMessages(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.managerUtilsService.clearChannelMessages(interaction);
    }
}
