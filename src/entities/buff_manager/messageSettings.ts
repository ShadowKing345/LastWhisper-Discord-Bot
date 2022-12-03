import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";

/**
 * Settings for posting the daily messages.
 */
@Entity()
export class MessageSettings {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: true })
  public channelId: string = null;

  @Column({ nullable: true })
  public hour: string = null;

  @Column({ type: "int", nullable: true })
  public dow: number = null;

  @Column({ nullable: true })
  public buffMessage: string = null;

  @Column({ nullable: true })
  public weekMessage: string = null;

  @OneToOne(() => BuffManagerConfig, config => config.messageSettings)
  @JoinColumn({ name: "config_id" })
  public guildConfig: Relation<BuffManagerConfig>;
}
