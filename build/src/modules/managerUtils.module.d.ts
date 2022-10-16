import { ModuleBase, EventListener } from "../utils/models/index.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
export declare class ManagerUtilsModule extends ModuleBase {
    private managerUtilsService;
    moduleName: string;
    commands: CommandBuilders;
    listeners: EventListener[];
    constructor(managerUtilsService: ManagerUtilsService, permissionManagerService: PermissionManagerService);
    private onMemberRemoved;
    private onMemberBanned;
    private subcommandResolver;
    private clearChannelMessages;
}
//# sourceMappingURL=managerUtils.module.d.ts.map