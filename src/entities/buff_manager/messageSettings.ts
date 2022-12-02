import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from "typeorm";
import { BuffManagerConfig } from "./buffManagerConfig.js";

/**
 * Settings for posting the daily messages.
 */
@Entity()
export class MessageSettings {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public channelId: string = null;

  @Column()
  public hour: string = null;

  @Column({
    type:"int",
    nullable: true
  })
  public dow: number = null;

  @Column()
  public buffMessage: string = null;

  @Column()
  public weekMessage: string = null;

  @OneToOne(() => BuffManagerConfig, config => config.messageSettings)
  @JoinColumn({name: "config_id"})
  public guildConfig: Relation<BuffManagerConfig>;
}
