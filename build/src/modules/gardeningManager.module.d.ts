import { ModuleBase, Task } from "../utils/models/index.js";
import { GardeningManagerService } from "../services/gardeningManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { CommandBuilders } from "../utils/objects/commandBuilder.js";
export declare class GardeningManagerModule extends ModuleBase {
    private gardeningManagerService;
    private static readonly command;
    moduleName: string;
    commands: CommandBuilders;
    tasks: Task[];
    constructor(gardeningManagerService: GardeningManagerService, permissionManagerService: PermissionManagerService);
    private register;
    private cancel;
    private list;
    private tick;
    private subCommandResolver;
}
//# sourceMappingURL=gardeningManager.module.d.ts.map