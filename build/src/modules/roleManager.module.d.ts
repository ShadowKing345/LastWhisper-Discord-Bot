import { pino } from "pino";
import { ModuleBase } from "../utils/models/index.js";
import { RoleManagerService } from "../services/roleManager.service.js";
import { PermissionManagerService } from "../services/permissionManager.service.js";
import { Commands } from "../utils/objects/command.js";
import { EventListeners } from "../utils/objects/eventListener.js";
export declare class RoleManagerModule extends ModuleBase {
    private roleManagerService;
    moduleName: string;
    eventListeners: EventListeners;
    commands: Commands;
    protected commandResolverKeys: {
        [key: string]: Function;
    };
    constructor(roleManagerService: RoleManagerService, logger: pino.Logger, permissionManagerService: PermissionManagerService);
    private onReady;
    private revokeRole;
    private registerMessage;
    private unregisterMessage;
}
//# sourceMappingURL=roleManager.module.d.ts.map