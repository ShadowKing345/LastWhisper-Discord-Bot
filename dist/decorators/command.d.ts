import { SlashCommand } from "../objects/index.js";
import { Module } from "../modules/module.js";
export declare function Command<T extends Module>(command: Partial<Omit<SlashCommand, "callback">>): (target: T, _: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=command.d.ts.map