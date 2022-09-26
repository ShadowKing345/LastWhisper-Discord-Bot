import { Reason } from "./reason.enum.js";
/**
 * Representation of a FFXIV gardening slot.
 */
export class Slot {
    player;
    duration;
    plant;
    reason = Reason.NONE;
    started;
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