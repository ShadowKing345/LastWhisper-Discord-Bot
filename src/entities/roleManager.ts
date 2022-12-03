import { BaseEntity } from "typeorm";

/**
 * Role manager configuration object.
 */
export class RoleManagerConfig extends BaseEntity {
  public id: string;
  public guildId: string = null;
  public acceptedRoleId: string = null;
  public reactionMessageIds: string[] = [];
  public reactionListeningChannel: string = null;
}
