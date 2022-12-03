import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { GuildConfigBase } from "./guildConfigBase.js";

/**
 * Role manager configuration object.
 */
@Entity()
export class RoleManagerConfig extends GuildConfigBase {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: true })
  public acceptedRoleId: string = null;

  @Column("text", { array: true })
  public reactionMessageIds: string[];

  @Column({ nullable: true })
  public reactionListeningChannel: string = null;
}
