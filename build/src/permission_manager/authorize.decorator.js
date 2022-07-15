import { container } from "tsyringe";
import { PermissionManagerService } from "./permissionManager.service.js";
export function authorize(...key) {
    return function (target, propertyKey, descriptor) {
        const permissionManager = target.permissionManager ?? container.resolve(PermissionManagerService);
        const originalValue = descriptor.value;
        descriptor.value = async function (interaction, ...args) {
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
//# sourceMappingURL=authorize.decorator.js.map