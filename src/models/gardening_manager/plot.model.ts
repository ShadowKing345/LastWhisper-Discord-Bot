import { Slot } from "./slot.model.js";

/**
 * Representation of a FFXIV gardening plot.
 */
export class Plot {
    public name: string;
    public description: string;
    public slots: Slot[];
}