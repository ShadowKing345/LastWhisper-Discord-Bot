import { IEntity } from "../../utils/objects/repositoryBase.js";

/**
 * Role manager configuration object.
 */
export class RoleManagerConfig implements IEntity {
    public _id;
    public guildId: string;
    public acceptedRoleId: string;
    public reactionMessageIds: string[];
    public reactionListeningChannel: string;
}
