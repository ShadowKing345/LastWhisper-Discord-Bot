import { IEntity } from "../../utils/objects/repositoryBase.js";
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";

/**
 * Role manager configuration object.
 */
export class RoleManagerConfig extends ToJsonBase<RoleManagerConfig> implements IEntity {
    public _id;
    public guildId: string = null!;
    public acceptedRoleId: string = null!;
    public reactionMessageIds: string[] = [];
    public reactionListeningChannel: string = null!;
}
