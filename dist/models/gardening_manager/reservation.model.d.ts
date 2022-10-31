import { Reason } from "./reason.enum.js";
import { ISlotBase } from "./slotBase.interface.js";
export declare class Reservation implements ISlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
    constructor(player: string, plant: string, duration: number, reason: Reason);
}
//# sourceMappingURL=reservation.model.d.ts.map