/**
 * Decorator that wraps a function call with a permission check.
 * @param key Names of the permission check key.
 */
export function authorize(...key) {
    return function (target, propertyKey, descriptor) {
        const permissionManagerService = target.permissionManagerService;
        const originalValue = descriptor.value;
        descriptor.value = async function (interaction, ...args) {
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
//# sourceMappingURL=authorize.js.map