import { CommandInteraction } from "discord.js";
import { container } from "tsyringe";

import { PermissionManagerService } from "./permissionManager.service.js";

export function authorize(...key: string[]) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const permissionManager = target.permissionManager ?? container.resolve(PermissionManagerService);
        const originalValue = descriptor.value;

        descriptor.value = async function (interaction: CommandInteraction, ...args: any[]) {
            if (!await permissionManager.isAuthorized(interaction, key.join("."))) {
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