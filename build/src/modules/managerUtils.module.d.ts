import { ModuleBase } from "../utils/models/index.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
export declare class ManagerUtilsModule extends ModuleBase {
    private managerUtilsService;
    private static readonly commands;
    constructor(managerUtilsService: ManagerUtilsService, permissionManagerService: PermissionManagerService);
    private onMemberRemoved;
    private onMemberBanned;
    private subcommandResolver;
    private clearChannelMessages;
}
//# sourceMappingURL=managerUtils.module.d.ts.map