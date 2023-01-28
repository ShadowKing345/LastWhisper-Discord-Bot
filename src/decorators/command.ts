import { SlashCommands } from "../objects/index.js";
import { ModuleService } from "../config/index.js";

/**
 * Decorator that attempts to register commands to the module service system.
 * Methods decorated with this command act as the executed method.
 */
export function Command(command: Omit<SlashCommands, "">): (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => void {
  console.log(command);

  return function(target: unknown, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    console.log(target, propertyKey, descriptor);

    if (typeof target === "object" && "name" in target && typeof target["name"] === "string") {
      ModuleService.registerCommand(command, target.name);
    }

    return descriptor;
  };
}