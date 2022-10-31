import { Reason } from "./reason.enum.js";
export class Reservation {
    player;
    duration;
    plant;
    reason = Reason.NONE;
    constructor(player, plant, duration, reason) {
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
    }
}
//# sourceMappingURL=reservation.model.js.map