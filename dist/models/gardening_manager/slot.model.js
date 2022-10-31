import { Reason } from "./reason.enum.js";
export class Slot {
    player = null;
    duration = null;
    plant = null;
    reason = Reason.NONE;
    started = null;
    next = [];
    constructor(player, plant, duration, reason, started, next = []) {
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
        this.started = started;
        this.next = next;
    }
}
//# sourceMappingURL=slot.model.js.map