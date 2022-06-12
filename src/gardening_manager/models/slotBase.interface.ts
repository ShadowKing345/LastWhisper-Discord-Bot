import { Reason } from "./reason.enum.js";

export interface ISlotBase {
    player: string;
    duration: number;
    plant: string;
    reason: Reason;
}