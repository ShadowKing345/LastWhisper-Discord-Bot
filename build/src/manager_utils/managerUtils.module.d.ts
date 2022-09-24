import { ModuleBase } from "../utils/models/index.js";
import { ManagerUtilsService } from "./managerUtils.service.js";
export declare class ManagerUtilsModule extends ModuleBase {
    private managerUtilsService;
    private static readonly commands;
    constructor(managerUtilsService: ManagerUtilsService);
    private onMemberRemoved;
    private onMemberBanned;
    private subcommandResolver;
    private clearChannelMessages;
}
//# sourceMappingURL=managerUtils.module.d.ts.map