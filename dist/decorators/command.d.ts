import { SlashCommand } from "../objects/index.js";
export declare function Command(command: Partial<Omit<SlashCommand, "callback">>): (target: unknown, _: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=command.d.ts.map