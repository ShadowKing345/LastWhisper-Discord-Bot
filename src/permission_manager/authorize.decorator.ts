import { CommandInteraction } from "discord.js";

export function authorize(...key: string[]) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalValue = descriptor.value;

        descriptor.value = async function (interaction: CommandInteraction, ...args: any[]) {
            if (!await this.permissionManager.isAuthorized(interaction, key.join("."))) {
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