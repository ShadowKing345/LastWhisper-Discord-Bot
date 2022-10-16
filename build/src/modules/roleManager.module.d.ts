import { pino } from "pino";
import { EventListener, ModuleBase } from "../utils/models/index.js";
import { RoleManagerService } from "../services/roleManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
export declare class RoleManagerModule extends ModuleBase {
    private roleManagerService;
    private logger;
    moduleName: string;
    listeners: EventListener[];
    commands: CommandBuilders;
    constructor(roleManagerService: RoleManagerService, logger: pino.Logger, permissionManagerService: PermissionManagerService);
    private onReady;
    private subcommandResolver;
    private revokeRole;
    private registerMessage;
    private unregisterMessage;
}
//# sourceMappingURL=roleManager.module.d.ts.map