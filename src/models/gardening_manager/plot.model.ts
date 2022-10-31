import { Slot } from "./slot.model.js";

/**
 * Representation of a FFXIV gardening plot.
 */
export class Plot {
  public name: string = null;
  public description: string = null;
  public slots: Slot[] = [];
}
