import { Module } from "../../modules/module.js";
import { ClientEvents } from "discord.js";
export declare function Event<T extends Module, K extends keyof ClientEvents>(event: K): (target: unknown, _: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=event.d.ts.map