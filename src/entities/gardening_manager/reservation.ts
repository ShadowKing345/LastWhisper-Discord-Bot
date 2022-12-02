import { Reason } from "./reason.js";
import { ISlotBase } from "./slotBase.js";

/**
 * Reservation object.
 */
export class Reservation implements ISlotBase {
  public player: string;
  public duration: number;
  public plant: string;
  public reason: Reason = Reason.NONE;

  constructor(player: string, plant: string, duration: number, reason: Reason) {
    this.player = player;
    this.duration = duration;
    this.reason = reason;
    this.plant = plant;
  }
}
