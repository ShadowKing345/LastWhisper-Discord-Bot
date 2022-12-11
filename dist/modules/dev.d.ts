import { Module } from "./module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Commands } from "../utils/objects/command.js";
import { Logger } from "../utils/logger.js";
export declare class DevModule extends Module {
    protected logger: Logger;
    moduleName: string;
    commands: Commands;
    buttons: {
        buttonTest1: (interaction: ChatInputCommandInteraction) => Promise<void | InteractionResponse<boolean>>;
    };
    constructor(permissionManagerService: PermissionManagerService);
    private testInteractionTypes;
    private testModal;
    private buttonTest;
}
//# sourceMappingURL=dev.d.ts.map