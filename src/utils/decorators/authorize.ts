import { CommandInteraction } from "discord.js";
import { ModuleBase } from "../objects/moduleBase.js";
import { DecoratorError } from "../models/index.js";

/**
 * Decorator that wraps a function call with a permission check.
 * @param key Names of the permission check key.
 */
export function authorize<T extends ModuleBase>(...key: string[]): (target: T, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor {
    return function (target: T, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const permissionManagerService = target.permissionManagerService;

        if (!permissionManagerService) {
            throw new DecoratorError("Cannot find the permission manager service. Please provide this service to the base class under the name 'permissionManagerService'.");
        }

        const originalValue = descriptor.value;

        descriptor.value = async function (interaction: CommandInteraction, ...args: any[]) {
            if (!await permissionManagerService.isAuthorized(interaction, key.join("."))) {
                return interaction.reply({
                    content: "Sorry you do not have the permissions to use this command.",
                    ephemeral: true,
                });
            }
            args.unshift(interaction);

            return originalValue.apply(this, args);
        };

        return descriptor;
    };
}