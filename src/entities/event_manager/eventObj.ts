/**
 * Event object.
 */
import { DateTime } from "luxon";
import { BaseEntity, Relation, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";

@Entity()
export class EventObj extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string = null;

  @Column()
  public description: string = null;

  @Column()
  public dateTime: number = null;

  @Column("text", {array: true})
  public additional: [string, string][] = [];

  @ManyToOne(() => EventManagerConfig, config => config.events)
  @JoinColumn({name:"config_id"})
  public guildConfig: Relation<EventManagerConfig>;

  constructor() {
    super();
  }

  /**
   * Checks if teh event is valid.
   */
  public get isValid(): boolean {
    return (
      this.name != "" &&
      this.description != "" &&
      this.dateTime != null &&
      this.dateTime > DateTime.now().toUnixInteger()
    );
  }
}
