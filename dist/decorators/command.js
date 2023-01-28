import { ModuleService } from "../config/index.js";
import { SlashCommand } from "../objects/index.js";
export function Command(command) {
    return function (target, _, descriptor) {
        console.log(target.constructor.name);
        ModuleService.registerCommand(new SlashCommand({
            name: command.name,
            description: command.description,
            callback: descriptor.value,
            subcommands: command.subcommands,
            options: command.options,
        }), target.constructor.name);
        return descriptor;
    };
}
//# sourceMappingURL=command.js.map