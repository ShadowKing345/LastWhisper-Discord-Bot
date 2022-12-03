import { Entity, Column, PrimaryGeneratedColumn, Relation, ManyToOne, JoinTable } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";

/**
 * Buff object representing a days worth of buffs.
 */
@Entity()
export class Buff {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public text: string = null;

  @Column()
  public imageUrl: string = null;

  @ManyToOne(() => BuffManagerConfig, config => config.buffs)
  @JoinTable({name: "guild_config_id"})
  public guildConfig: Relation<BuffManagerConfig>;
}