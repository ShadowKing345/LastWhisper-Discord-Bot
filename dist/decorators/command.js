import { ModuleService } from "../config/index.js";
import { SlashCommand } from "../objects/index.js";
export function Command(command) {
    return function (target, _, descriptor) {
        ModuleService.registerCommand(new SlashCommand({
            name: command.name,
            description: command.description,
            callback: descriptor.value,
            subcommands: command.subcommands,
            options: command.options,
        }), target.constructor);
        return descriptor;
    };
}
//# sourceMappingURL=command.js.map