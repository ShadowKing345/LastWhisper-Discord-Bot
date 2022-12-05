import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";

/**
 * Event manager configuration object.
 */
@Entity()
export class EventManagerSettings extends EntityBase {

  @Column({ nullable: true })
  public listenerChannelId: string = null;

  @Column({ nullable: true })
  public postingChannelId: string = null;

  @Column("character", { array: true })
  public delimiterCharacters: [ string, string ] = [ "[", "]" ];

  @Column({ nullable: true })
  public announcement: string = null;

  @Column({ nullable: true })
  public description: string = null;

  @Column({ nullable: true })
  public dateTime: string = null;

  @Column("character", { array: true })
  public exclusionList: string[] = [];

  @Column("text", { array: true })
  public dateTimeFormat: string[] = [];

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
