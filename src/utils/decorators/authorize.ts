import { ChatInputCommandInteraction } from "discord.js";
import { ModuleBase } from "../objects/moduleBase.js";

/**
 * Decorator that wraps a function call with a permission check.
 * If the permission manager service is missing the function is called as if nothing happened.
 * @param key Names of the permission check key.
 */
export function authorize<T extends ModuleBase>(key: string): (target: T, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor {
    return function (target: T, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (interaction: ChatInputCommandInteraction, ...args: any[]) {
            if ((this as T).permissionManagerService && !await (this as T).permissionManagerService.isAuthorized(interaction, key)) {
                return interaction.reply({
                    content: "Sorry you do not have the permissions to use this command.",
                    ephemeral: true,
                });
            }

            return originalMethod.apply(this, [ interaction, ...args ]);
        };

        return descriptor;
    };
}