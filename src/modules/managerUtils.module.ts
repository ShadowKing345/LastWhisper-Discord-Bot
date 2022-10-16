import { GuildBan, GuildMember, ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { ModuleBase, EventListener } from "../utils/models/index.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { registerModule } from "../utils/decorators/registerModule.js";
import { CommandBuilder, CommandBuilderOption, CommandBuilders } from "../utils/objects/commandBuilder.js";
import { createLogger } from "../utils/loggerService.js";
import { pino } from "pino";

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
        execute: interaction => this.commandResolver(interaction),
    }) ];
    public listeners: EventListener[] = [
        { event: "guildBanAdd", run: async (_, member) => await this.onMemberBanned(member) },
        { event: "guildMemberRemove", run: async (client, member) => await this.onMemberRemoved(member) },
    ];

    protected commandResolverKeys: { [key: string]: Function } = {
        "manager_utils.clear": this.clear,
    };

    constructor(
        private managerUtilsService: ManagerUtilsService,
        permissionManagerService: PermissionManagerService,
        @createLogger(ManagerUtilsModule.name) logger: pino.Logger,
    ) {
        super(permissionManagerService, logger);
    }

    private onMemberRemoved(member: GuildMember): Promise<void> {
        return this.managerUtilsService.onMemberRemoved(member);
    }

    private onMemberBanned(ban: GuildBan): Promise<void> {
        return this.managerUtilsService.onMemberBanned(ban);
    }

    private clear(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {
        return this.managerUtilsService.clearChannelMessages(interaction);
    }
}
