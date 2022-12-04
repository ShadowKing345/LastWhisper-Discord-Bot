import { Reason } from "./reason.js";
import { Reservation } from "./reservation.js";
import { ISlotBase } from "./slotBase.js";
export declare class Slot implements ISlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
    started: number;
    next: Reservation[];
    constructor(player: string, plant: string, duration: number, reason: Reason, started: number, next?: Reservation[]);
}
//# sourceMappingURL=slot.d.ts.map