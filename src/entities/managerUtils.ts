import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { GuildConfigBase } from "./guildConfigBase.js";

/**
 * Manager utils configuration object.
 */
@Entity()
export class ManagerUtilsConfig extends GuildConfigBase {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: true })
  public loggingChannel: string = null;

  @Column("text", { array: true })
  public clearChannelBlacklist: string[];
}
