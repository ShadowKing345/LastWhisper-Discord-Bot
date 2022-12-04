import { EventObj } from "./eventObj.js";
import { Reminder } from "./reminder.js";
import { Tags } from "./tags.js";
import { Entity, Column, OneToOne, OneToMany, AfterLoad, AfterInsert, AfterUpdate } from "typeorm";
import { EntityBase } from "../entityBase.js";

/**
 * Event manager configuration object.
 */
@Entity()
export class EventManagerConfig extends EntityBase {
  @Column({ nullable: true })
  public listenerChannelId: string = null;

  @Column({ nullable: true })
  public postingChannelId: string = null;

  @Column("character", { array: true })
  public delimiterCharacters: [string, string] = ["[", "]"];

  @OneToOne(() => Tags, tag => tag.guildConfig, { cascade: true, orphanedRowAction: "delete", onDelete: "CASCADE" })
  public tags: Tags = new Tags();

  @Column("text", { array: true })
  public dateTimeFormat: string[] = [];

  @OneToMany(() => EventObj, obj => obj.guildConfig, {
    cascade: true,
    orphanedRowAction: "delete",
    onDelete: "CASCADE",
  })
  public events: EventObj[];

  @OneToMany(() => Reminder, obj => obj.guildConfig, {
    cascade: true,
    orphanedRowAction: "delete",
    onDelete: "CASCADE",
  })
  public reminders: Reminder[];

  public getEventByIndex(index: number): EventObj {
    return this.events[index % this.events.length];
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  public nullChecks(): void {
    if (!this.delimiterCharacters) {
      this.delimiterCharacters = ["[", "]"];
    }

    if (!this.dateTimeFormat) {
      this.dateTimeFormat = [];
    }

    if (!this.events) {
      this.events = [];
    }

    if (!this.reminders) {
      this.reminders = [];
    }
  }
}
