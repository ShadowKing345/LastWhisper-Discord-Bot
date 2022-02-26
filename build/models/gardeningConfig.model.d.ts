export interface SlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
}
export declare class Reservation implements SlotBase {
    player: string;
    duration: number;
    reason: Reason;
    plant: string;
    constructor(player: string, plant: string, duration: number, reason: Reason);
}
export declare enum Reason {
    NONE = 0,
    GROWING = 1,
    BREADING = 2
}
export declare class Slot implements SlotBase {
    player: string;
    duration: number;
    reason: Reason;
    plant: string;
    started: number;
    next: Reservation[];
    constructor(player: string, plant: string, duration: number, reason: Reason, started: number, next?: Reservation[]);
}
export declare class Plot {
    name: string;
    description: string;
    slots: Slot[];
}
export declare class GardeningConfig {
    guildId: string;
    plots: Plot[];
    messagePostingChannelId: string;
}
