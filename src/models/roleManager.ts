import { IEntity } from "../utils/objects/repositoryBase.js";
import { ToJsonBase } from "../utils/objects/toJsonBase.js";

/**
 * Role manager configuration object.
 */
export class RoleManagerConfig extends ToJsonBase<RoleManagerConfig> implements IEntity<string> {
  public _id: string;
  public guildId: string = null;
  public acceptedRoleId: string = null;
  public reactionMessageIds: string[] = [];
  public reactionListeningChannel: string = null;
}
