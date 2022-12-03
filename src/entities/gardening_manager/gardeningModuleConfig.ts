import { Plot } from "./plot.js";
import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { GuildConfigBase } from "../guildConfigBase.js";

/**
 * Gardening module configuration object.
 */
@Entity()
export class GardeningModuleConfig extends GuildConfigBase {

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @OneToMany(() => Plot, plot => plot.guildConfig, {
    cascade: true,
    orphanedRowAction: "delete",
    onDelete: "CASCADE",
  })
  public plots: Plot[];

  @Column({nullable: true})
  public messagePostingChannelId: string = null;
}
