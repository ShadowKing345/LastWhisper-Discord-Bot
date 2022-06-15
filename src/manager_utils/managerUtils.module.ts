import { CommandInteraction, GuildBan, GuildMember } from "discord.js";
import { singleton } from "tsyringe";

import { addCommandKeys, authorize, PermissionManagerService } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { ManagerUtilsService } from "./managerUtils.service.js";

@singleton()
export class ManagerUtilsModule extends ModuleBase {

    @addCommandKeys()
    private static readonly commands = {
        $index: "manager_utils",
        Clear: "clear",
    }

    constructor(
        private managerUtilsService: ManagerUtilsService,
        private permissionManager: PermissionManagerService,
    ) {
        super();

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
                        .setRequired(false)
                    )
                ),
            run: interaction => this.subcommandResolver(interaction)
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

    private subcommandResolver(interaction: CommandInteraction): Promise<void> {
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
    private clearChannelMessages(interaction: CommandInteraction): Promise<void> {
        return this.managerUtilsService.clearChannelMessages(interaction);
    }
}
