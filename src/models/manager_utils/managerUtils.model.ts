import { IEntity } from "../../utils/objects/repositoryBase.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";

/**
 * Manager utils configuration object.
 */
export class ManagerUtilsConfig extends ToJsonBase<ManagerUtilsConfig> implements IEntity {
    public _id;
    public guildId: string = null!;
    public loggingChannel: string = null!;
    public clearChannelBlacklist: string[] = [];
}
