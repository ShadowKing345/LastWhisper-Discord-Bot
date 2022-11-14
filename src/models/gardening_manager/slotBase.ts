import { Reason } from "./reason.js";

/**
 * Base class for a slot.
 */
export interface ISlotBase {
  player: string;
  duration: number;
  plant: string;
  reason: Reason;
}
