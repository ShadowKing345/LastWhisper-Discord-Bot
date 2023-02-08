import { Module } from "../../modules/module.js";
import { Timer as TimerObject } from "../../objects/timer.js";
export declare function Timer<T extends Module>(timer: Omit<TimerObject, "execute">): (target: unknown, _: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=timer.d.ts.map