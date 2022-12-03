import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Module } from "../utils/objects/index.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
export declare class PermissionManagerModule extends Module {
    private service;
    private readonly BadKeyErrorMessages;
    static permissionKeys: {
        list: string;
        addRole: string;
        removeRole: string;
        config: string;
        reset: string;
    };
    moduleName: string;
    commands: Commands;
    protected commandResolverKeys: {
        "permissions.add_role": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "permissions.remove_role": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "permissions.set_config": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "permissions.reset": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
        "permissions.list": (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse | void>;
    };
    constructor(service: PermissionManagerService, logger: pino.Logger);
    protected commandResolver(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    addRole(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    removeRole(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    config(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    reset(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    listPermissions(interaction: ChatInputCommandInteraction): Promise<InteractionResponse | void>;
    private commandKeyHelperBuilder;
}
//# sourceMappingURL=permissionManager.d.ts.map