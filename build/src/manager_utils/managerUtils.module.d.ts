import { PermissionManagerService } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { ManagerUtilsService } from "./managerUtils.service.js";
export declare class ManagerUtilsModule extends ModuleBase {
    private managerUtilsService;
    private permissionManager;
    private static readonly commands;
    constructor(managerUtilsService: ManagerUtilsService, permissionManager: PermissionManagerService);
    private onMemberRemoved;
    private onMemberBanned;
    private subcommandResolver;
    private clearChannelMessages;
}
//# sourceMappingURL=managerUtils.module.d.ts.map