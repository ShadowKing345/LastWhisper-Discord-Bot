import { IEntity } from "../../utils/objects/repositoryBase.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
export declare class RoleManagerConfig extends ToJsonBase<RoleManagerConfig> implements IEntity<string> {
    _id: string;
    guildId: string;
    acceptedRoleId: string;
    reactionMessageIds: string[];
    reactionListeningChannel: string;
}
//# sourceMappingURL=roleManager.d.ts.map