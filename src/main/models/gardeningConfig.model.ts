export interface SlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
}

export class Reservation implements SlotBase {
    public player: string;
    public duration: number;
    public plant: string;
    public reason: Reason = Reason.NONE;

    constructor(player: string, plant: string, duration: number, reason: Reason) {
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
    }
}

// noinspection JSUnusedGlobalSymbols
export enum Reason {
    NONE = "NONE",
    GROWING = "GROWING",
    BREADING = "BREADING"
}

export class Slot implements SlotBase {
    public player: string;
    public duration: number;
    public plant: string;
    public reason: Reason = Reason.NONE;
    public started: number;
    public next: Reservation[] = [];

    constructor(player: string, plant: string, duration: number, reason: Reason, started: number, next: Reservation[] = []) {
        this.player = player;
        this.duration = duration;
        this.reason = reason;
        this.plant = plant;
        this.started = started;
        this.next = next;
    }
}

export class Plot {
    public name: string;
    public description: string;
    public slots: Slot[];
}

export class GardeningConfig {
    public guildId: string;
    public plots: Plot[] = [];
    public messagePostingChannelId: string;
}
