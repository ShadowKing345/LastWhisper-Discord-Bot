import { pino } from "pino";
import { ModuleBase } from "../utils/models/index.js";
import { RoleManagerService } from "../services/roleManager.service.js";
export declare class RoleManagerModule extends ModuleBase {
    private roleManagerService;
    private logger;
    private static readonly commands;
    constructor(roleManagerService: RoleManagerService, logger: pino.Logger);
    private onReady;
    private subcommandResolver;
    private revokeRole;
    private registerMessage;
    private unregisterMessage;
}
//# sourceMappingURL=roleManager.module.d.ts.map