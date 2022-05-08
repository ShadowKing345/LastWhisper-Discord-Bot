import { BasicModel } from "./basicModel.js";
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
// noinspection JSUnusedGlobalSymbols
export var Reason;
(function (Reason) {
    Reason["NONE"] = "NONE";
    Reason["GROWING"] = "GROWING";
    Reason["BREADING"] = "BREADING";
})(Reason || (Reason = {}));
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
export class Plot {
    name;
    description;
    slots;
}
export class GardeningConfig extends BasicModel {
    guildId;
    plots = [];
    messagePostingChannelId;
}
//# sourceMappingURL=gardeningConfig.model.js.map