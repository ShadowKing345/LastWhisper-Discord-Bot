import { IEntity } from "../utils/objects/repositoryBase.js";
import { ToJsonBase } from "../utils/objects/toJsonBase.js";
export declare class ManagerUtilsConfig extends ToJsonBase<ManagerUtilsConfig> implements IEntity<string> {
    _id: string;
    guildId: string;
    loggingChannel: string;
    clearChannelBlacklist: string[];
}
//# sourceMappingURL=managerUtils.d.ts.map