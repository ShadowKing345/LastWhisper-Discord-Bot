/**
 * Decorator that wraps a function call with a permission check.
 * If the permission manager service is missing the function is called as if nothing happened.
 * @param key Names of the permission check key.
 */
export function authorize(key) {
    return function (target, propertyKey, descriptor) {
        const originalValue = descriptor.value;
        descriptor.value = async function (interaction, ...args) {
            if (!this.permissionManagerService) {
                return originalValue.apply(this, args);
            }
            if (!await this.permissionManagerService.isAuthorized(interaction, key)) {
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