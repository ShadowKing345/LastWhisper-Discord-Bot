import { ModuleBase } from "../utils/objects/moduleBase.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { InteractionResponse } from "discord.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
import { pino } from "pino";
import { EventListeners } from "../utils/models/index.js";
export declare class DevModule extends ModuleBase {
    moduleName: string;
    commands: CommandBuilders;
    buttons: {
        buttonTest1: (interaction: any) => Promise<void | InteractionResponse<boolean>>;
    };
    eventListeners: EventListeners;
    constructor(permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private testInteractionTypes;
    private testModal;
    private buttonTest;
}
//# sourceMappingURL=dev.module.d.ts.map