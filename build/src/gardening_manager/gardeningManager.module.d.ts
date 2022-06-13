import { PermissionManagerService } from "../permission_manager/index.js";
import { ModuleBase } from "../shared/models/moduleBase.js";
import { GardeningManagerService } from "./gardeningManager.service.js";
export declare class GardeningManagerModule extends ModuleBase {
    private gardeningManagerService;
    private permissionManager;
    private static readonly command;
    constructor(gardeningManagerService: GardeningManagerService, permissionManager: PermissionManagerService);
    private register;
    private cancel;
    private list;
    private tick;
    private subCommandResolver;
}
//# sourceMappingURL=gardeningManager.module.d.ts.map