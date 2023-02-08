export function deferReply(ephemeral = false) {
    return function (_target, _propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (interaction, ...args) {
            const response = await interaction.deferReply({ ephemeral });
            await originalMethod.apply(this, [interaction, ...args]);
            return response;
        };
        return descriptor;
    };
}
//# sourceMappingURL=deferReply.js.map