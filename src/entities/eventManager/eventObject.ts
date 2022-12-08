/**
 * Event object.
 */
import { DateTime } from "luxon";
import { Entity, Column } from "typeorm";
import { EntityBase } from "../entityBase.js";

@Entity()
export class EventObject extends EntityBase {

  @Column({ nullable: true })
  public messageId: string = null;

  @Column()
  public name: string = null;

  @Column()
  public description: string = null;

  @Column()
  public dateTime: number = null;

  @Column("text", { array: true })
  public additional: [ string, string ][] = [];

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

  public merge(obj: Partial<EventObject>): EventObject {


    if (obj.messageId) {
      this.messageId = obj.messageId;
    }

    return this;
  }
}
