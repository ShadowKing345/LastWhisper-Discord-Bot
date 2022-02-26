export class Reservation {
    constructor(player, plant, duration, reason) {
        this.reason = Reason.NONE;
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
    }
}
export var Reason;
(function (Reason) {
    Reason[Reason["NONE"] = 0] = "NONE";
    Reason[Reason["GROWING"] = 1] = "GROWING";
    Reason[Reason["BREADING"] = 2] = "BREADING";
})(Reason || (Reason = {}));
export class Slot {
    constructor(player, plant, duration, reason, started, next = []) {
        this.reason = Reason.NONE;
        this.next = [];
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
        this.started = started;
        this.next = next;
    }
}
export class Plot {
}
export class GardeningConfig {
    constructor() {
        this.plots = [];
    }
}
//# sourceMappingURL=gardeningConfig.model.js.map