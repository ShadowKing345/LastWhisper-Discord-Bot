import { ModuleBase, EventListener } from "../utils/models/index.js";
import { ManagerUtilsService } from "../services/managerUtils.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
import { pino } from "pino";
export declare class ManagerUtilsModule extends ModuleBase {
    private managerUtilsService;
    moduleName: string;
    commands: CommandBuilders;
    listeners: EventListener[];
    protected commandResolverKeys: {
        [key: string]: Function;
    };
    constructor(managerUtilsService: ManagerUtilsService, permissionManagerService: PermissionManagerService, logger: pino.Logger);
    private onMemberRemoved;
    private onMemberBanned;
    private clear;
}
//# sourceMappingURL=managerUtils.module.d.ts.map