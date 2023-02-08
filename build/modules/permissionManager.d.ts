import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "./module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { SlashCommands } from "../objects/index.js";
import { Logger } from "../config/logger.js";
export declare class PermissionManagerModule extends Module {
    private service;
    protected static readonly logger: Logger;
    static permissionKeys: {
        list: string;
        addRole: string;
        removeRole: string;
        config: string;
        reset: string;
    };
    moduleName: string;
    commands: SlashCommands;
    protected commandResolverKeys: {
        "permissions.add_role": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "permissions.remove_role": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "permissions.set_config": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "permissions.reset": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "permissions.list": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(service: PermissionManagerService);
    addRole(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    removeRole(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    config(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    reset(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    listPermissions(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    private commandKeyHelperBuilder;
}
//# sourceMappingURL=permissionManager.d.ts.map