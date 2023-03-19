import { ChatInputCommandInteraction, GuildBan, GuildMember, InteractionResponse, PartialGuildMember, } from "discord.js";
// import { Logger } from "../config/logger.js";
import { module, SubCommand, Event } from "../decorators/index.js";
import { ManagerUtilsService } from "../services/managerUtils.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Module } from "./module.js";

const moduleName = "ManagerUtils";

/**
 * Module that provides utilities for the managers.
 */
@module( {
    moduleName: moduleName,
    baseCommand: {
        name: "manager_utils",
        description: "Utility functions for managers.",
    }
} )
export class ManagerUtilsModule extends Module {
    // private static readonly logger: Logger = new Logger( "ManagerUtilsModule" );
    
    constructor(
        private managerUtilsService: ManagerUtilsService,
        permissionManagerService: PermissionManagerService,
    ) {
        super( permissionManagerService );
    }

    /**
     * Event that posts a message to a given channel if a user leaves the guild for any reason.
     * @param member Guild member that has left.
     * @private
     */
    @Event("guildMemberRemove")
    public onMemberRemoved( member: GuildMember | PartialGuildMember ): Promise<void> {
        return this.managerUtilsService.onMemberRemoved( member );
    }

    /**
     * Event that posts a message when the user is banned from the guild.
     * @see onMemberRemoved
     * @param ban The guild ban object.
     * @private
     */
    @Event("guildBanAdd")
    public onMemberBanned( ban: GuildBan ): Promise<void> {
        return this.managerUtilsService.onMemberBanned( ban );
    }

    /**
     * Command that attempts to clear a channel of messages.
     * @param interaction
     * @private
     */
    @SubCommand( {
        name: "clear",
        description: "Clears a channel of its messages.",
        options: [
            {
                name: "amount",
                description: "The amount of messages to clear. Default 10.",
            },
        ],
    } )
    public clear( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse | void> {
        return this.managerUtilsService.clearChannelMessages( interaction );
    }
}
