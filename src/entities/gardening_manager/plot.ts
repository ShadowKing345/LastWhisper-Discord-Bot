import { Slot } from "./slot.js";

/**
 * Representation of an FF XIV gardening plot.
 */
export class Plot {
  public name: string = null;
  public description: string = null;
  public slots: Slot[] = [];
}
