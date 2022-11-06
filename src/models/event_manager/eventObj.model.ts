/**
 * Event object.
 */
import { ToJsonBase } from "../../utils/objects/toJsonBase.js";
import { DateTime } from "luxon";

export class EventObj extends ToJsonBase<EventObj> {
  public id: string = null;
  public name: string = null;
  public description: string = null;
  public dateTime: number = null;
  public additional: [ string, string ][] = [];

  constructor(data: Partial<EventObj> = null) {
    super();

    if (data) {
      this.merge(data);
    }
  }

  /**
   * Checks if teh event is valid.
   */
  public get isValid(): boolean {
    return this.name != "" && this.description != "" && this.dateTime != null && this.dateTime > DateTime.now().toUnixInteger();
  }
}
