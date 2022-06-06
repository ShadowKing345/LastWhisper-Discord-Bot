import { ModuleBase } from "../classes/moduleBase.js";
import { RoleManagerService } from "../services/roleManager.service.js";
export declare class RoleManagerModule extends ModuleBase {
    private roleManagerService;
    private readonly logger;
    constructor(roleManagerService: RoleManagerService);
    private onReady;
    private subcommandResolver;
    private revokeRole;
    private registerMessage;
    private unregisterMessage;
}
//# sourceMappingURL=roleManager.module.d.ts.map