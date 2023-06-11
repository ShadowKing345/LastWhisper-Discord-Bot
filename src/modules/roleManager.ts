import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";

import { Module } from "./module.js";
import { Bot } from "../objects/bot.js";
import { RoleManagerService } from "../services/roleManager.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { module, SubCommand, Event } from "../decorators/index.js";
import { Logger } from "../utils/logger/logger.js";

const moduleName = "RoleManager";

/**
 * Module for managing the roles of a Guild.
 * This module provides a simple apply for role scenario where users are give a role based on context.
 */
@module( {
    moduleName: moduleName,
    baseCommand: {
        name: "role_manager",
        description: "Manages roles within a guild.",
    }
} )
export class RoleManagerModule extends Module {
    protected static readonly logger = Logger.build( "RoleManagerModule" );

    constructor(
        private roleManagerService: RoleManagerService,
        permissionManagerService: PermissionManagerService,
    ) {
        super( permissionManagerService );
    }

    /**
     * On ready event to set up reaction listeners.
     * @param client The Discord Client.
     * @private
     */
    @Event( "ready" )
    public onReady( client: Bot ): Promise<void> {
        return this.roleManagerService.onReady( client );
    }

    /**
     * Removes authorized role from all users. Effectively resetting permissions.
     * @param interaction The Discord interaction.
     * @private
     */
    @SubCommand( {
        name: "revoke_role",
        description: "Revokes the role for all uses.",
    } )
    public revokeRole( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse> {
        return this.roleManagerService.revokeRole( interaction );
    }

    /**
     * Registers a message to be listened to.
     * @param interaction The Discord interaction.
     * @private
     */
    @SubCommand( {
        name: "register_message",
        description: "Registers a message to be reacted to.",
        options: [
            {
                name: "message_id",
                description: "The ID for the message.",
                required: true,
            },
        ],
    } )
    public registerMessage( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse> {
        return this.roleManagerService.registerMessage( interaction );
    }

    /**
     * Unregisters a message that is being listened to.
     * @param interaction The Discord interaction.
     * @private
     */
    @SubCommand( {
        name: "unregister_message",
        description: "Unregisters a message to be reacted to.",
        options: [
            {
                name: "message_id",
                description: "The ID for the message.",
                required: true,
            },
        ],
    } )
    public unregisterMessage( interaction: ChatInputCommandInteraction ): Promise<InteractionResponse> {
        return this.roleManagerService.unregisterMessage( interaction );
    }
}
