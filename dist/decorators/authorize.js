export function authorize(key) {
    return function (_target, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (interaction, ...args) {
            if (this.permissionManagerService &&
                !(await this.permissionManagerService.isAuthorized(interaction, key))) {
                if (interaction.deferred) {
                    await interaction.editReply({ content: "Sorry you do not have the permissions to use this command." });
                    return;
                }
                return interaction.isRepliable()
                    ? interaction.reply({
                        content: "Sorry you do not have the permissions to use this command.",
                        ephemeral: true,
                    })
                    : null;
            }
            return originalMethod.apply(this, [interaction, ...args]);
        };
        return descriptor;
    };
}
//# sourceMappingURL=authorize.js.map