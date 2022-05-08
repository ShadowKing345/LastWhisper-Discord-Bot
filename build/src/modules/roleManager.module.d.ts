import { ModuleBase } from "../classes/moduleBase.js";
import { RoleManagerConfigService } from "../services/roleManagerConfig.service.js";
export declare class RoleManagerModule extends ModuleBase {
    private service;
    constructor(service: RoleManagerConfigService);
    private static alterMembersRoles;
    private static sendButtons;
    private getConfig;
    private onReady;
    private onMemberJoin;
    private onReactionAdd;
}
//# sourceMappingURL=roleManager.module.d.ts.map