import { Reason } from "./reason.enum.js";
import { Reservation } from "./reservation.model.js";
import { ISlotBase } from "./slotBase.interface.js";

export class Slot implements ISlotBase {
    public player: string;
    public duration: number;
    public plant: string;
    public reason: Reason = Reason.NONE;
    public started: number;
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