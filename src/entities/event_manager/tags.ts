/**
 * Tag names for the event message parser.
 */
import { Relation, Entity, BaseEntity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm";
import { EventManagerConfig } from "./eventManagerConfig.js";

@Entity()
export class Tags extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: true })
  public announcement: string = null;

  @Column({ nullable: true })
  public description: string = null;

  @Column({ nullable: true })
  public dateTime: string = null;

  @Column("character", { array: true })
  public exclusionList: string[] = [];

  @OneToOne(() => EventManagerConfig, config => config.tags)
  @JoinColumn({ name: "config_id" })
  public guildConfig: Relation<EventManagerConfig>;

  constructor(
    announcement = "Event Announcement",
    description = "Event Description",
    dateTime = "Time",
    exclusionList: string[] = [],
  ) {
    super();

    this.announcement = announcement;
    this.description = description;
    this.dateTime = dateTime;
    this.exclusionList = exclusionList;
  }
}
