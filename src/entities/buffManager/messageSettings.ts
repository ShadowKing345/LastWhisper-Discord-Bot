import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";

/**
 * Settings for posting the daily messages.
 */
@Entity()
export class MessageSettings extends EntityBase{
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
}
