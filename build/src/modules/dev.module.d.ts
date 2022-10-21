import { ModuleBase } from "../utils/objects/moduleBase.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { InteractionResponse } from "discord.js";
import { Commands } from "../utils/objects/command.js";
import { pino } from "pino";
export declare class DevModule extends ModuleBase {
    moduleName: string;
    commands: Commands;
    buttons: {
        buttonTest1: (interaction: any) => Promise<void | InteractionResponse<boolean>>;
    };
    constructor(permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private testInteractionTypes;
    private testModal;
    private buttonTest;
}
//# sourceMappingURL=dev.module.d.ts.map