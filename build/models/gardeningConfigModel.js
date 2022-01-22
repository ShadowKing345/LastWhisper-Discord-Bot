"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GardeningConfig = exports.Plot = exports.Slot = exports.Reason = exports.Reservation = void 0;
class Reservation {
    constructor(player, plant, duration, reason) {
        this.reason = Reason.NONE;
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
    }
}
exports.Reservation = Reservation;
var Reason;
(function (Reason) {
    Reason[Reason["NONE"] = 0] = "NONE";
    Reason[Reason["GROWING"] = 1] = "GROWING";
    Reason[Reason["BREADING"] = 2] = "BREADING";
})(Reason = exports.Reason || (exports.Reason = {}));
class Slot {
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
exports.Slot = Slot;
class Plot {
}
exports.Plot = Plot;
class GardeningConfig {
    constructor() {
        this.plots = [];
    }
}
exports.GardeningConfig = GardeningConfig;
