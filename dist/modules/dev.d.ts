import { Module } from "./module.js";
import { PermissionManagerService } from "../services/permissionManager.js";
import { ChatInputCommandInteraction, InteractionResponse } from "discord.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
export declare class DevModule extends Module {
    moduleName: string;
    commands: Commands;
    buttons: {
        buttonTest1: (interaction: ChatInputCommandInteraction) => Promise<void | InteractionResponse<boolean>>;
    };
    constructor(permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private testInteractionTypes;
    private testModal;
    private buttonTest;
}
//# sourceMappingURL=dev.d.ts.map