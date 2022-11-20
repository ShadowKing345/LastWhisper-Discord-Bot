import { Reason } from "./reason.js";
import { ISlotBase } from "./slotBase.js";
export declare class Reservation implements ISlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
    constructor(player: string, plant: string, duration: number, reason: Reason);
}
//# sourceMappingURL=reservation.d.ts.map