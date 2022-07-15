import { pino } from "pino";
import { PermissionManagerService } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { RoleManagerService } from "./roleManager.service.js";
export declare class RoleManagerModule extends ModuleBase {
    private roleManagerService;
    private logger;
    private static readonly commands;
    constructor(roleManagerService: RoleManagerService, permissionManager: PermissionManagerService, logger: pino.Logger);
    private onReady;
    private subcommandResolver;
    private revokeRole;
    private registerMessage;
    private unregisterMessage;
}
//# sourceMappingURL=roleManager.module.d.ts.map