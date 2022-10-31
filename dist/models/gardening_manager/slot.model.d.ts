import { Reason } from "./reason.enum.js";
import { Reservation } from "./reservation.model.js";
import { ISlotBase } from "./slotBase.interface.js";
export declare class Slot implements ISlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
    started: number;
    next: Reservation[];
    constructor(player: string, plant: string, duration: number, reason: Reason, started: number, next?: Reservation[]);
}
//# sourceMappingURL=slot.model.d.ts.map