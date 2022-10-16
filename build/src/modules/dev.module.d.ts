import { ModuleBase } from "../utils/objects/moduleBase.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
import { pino } from "pino";
export declare class DevModule extends ModuleBase {
    moduleName: string;
    commands: CommandBuilders;
    constructor(permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private testInteractionTypes;
    private testModal;
}
//# sourceMappingURL=dev.module.d.ts.map