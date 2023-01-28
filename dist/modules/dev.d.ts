import { Module } from "./module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Logger } from "../config/logger.js";
import { SlashCommands } from "../objects/index.js";
export declare class DevModule extends Module {
    protected logger: Logger;
    moduleName: string;
    commands: SlashCommands;
    testChatInteractionFunction(interaction: ChatInputCommandInteraction): Promise<unknown>;
    buttons: {
        buttonTest1: (interaction: ChatInputCommandInteraction) => Promise<void | InteractionResponse<boolean>>;
    };
    constructor(permissionManagerService: PermissionManagerService);
    private testInteractionTypes;
    private testModal;
    private buttonTest;
}
//# sourceMappingURL=dev.d.ts.map