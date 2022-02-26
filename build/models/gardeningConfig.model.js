export class Reservation {
    constructor(player, plant, duration, reason) {
        this.reason = Reason.NONE;
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
    }
}
// noinspection JSUnusedGlobalSymbols
export var Reason;
(function (Reason) {
    Reason["NONE"] = "NONE";
    Reason["GROWING"] = "GROWING";
    Reason["BREADING"] = "BREADING";
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