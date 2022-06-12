import { ModuleBase } from "../shared/models/moduleBase.js";
import { PermissionManagerService } from "./permissionManager.service.js";
export declare class PermissionManagerModule extends ModuleBase {
    private permissionManagerService;
    private static readonly commands;
    constructor(permissionManagerService: PermissionManagerService);
    private subcommandResolver;
    private listPermissions;
    private addRoles;
    private removeRoles;
    private config;
    private reset;
    private static commandKeyHelperBuilder;
}
//# sourceMappingURL=permissionManager.module.d.ts.map