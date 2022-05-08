import { BasicModel } from "./basicModel.js";
export interface SlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
}
export declare class Reservation implements SlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
    constructor(player: string, plant: string, duration: number, reason: Reason);
}
export declare enum Reason {
    NONE = "NONE",
    GROWING = "GROWING",
    BREADING = "BREADING"
}
export declare class Slot implements SlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
    started: number;
    next: Reservation[];
    constructor(player: string, plant: string, duration: number, reason: Reason, started: number, next?: Reservation[]);
}
export declare class Plot {
    name: string;
    description: string;
    slots: Slot[];
}
export declare class GardeningConfig extends BasicModel {
    guildId: string;
    plots: Plot[];
    messagePostingChannelId: string;
}
//# sourceMappingURL=gardeningConfig.model.d.ts.map