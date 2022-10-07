import { ModuleBase } from "../utils/models/index.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
export declare class PermissionManagerModule extends ModuleBase {
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