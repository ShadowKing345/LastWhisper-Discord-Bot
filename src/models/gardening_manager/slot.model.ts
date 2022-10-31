import { Reason } from "./reason.enum.js";
import { Reservation } from "./reservation.model.js";
import { ISlotBase } from "./slotBase.interface.js";

/**
 * Representation of a FFXIV gardening slot.
 */
export class Slot implements ISlotBase {
    public player: string = null;
    public duration: number = null;
    public plant: string = null;
    public reason: Reason = Reason.NONE;
    public started: number = null;
    public next: Reservation[] = [];

    constructor(player: string, plant: string, duration: number, reason: Reason, started: number, next: Reservation[] = []) {
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
        this.started = started;
        this.next = next;
    }
}