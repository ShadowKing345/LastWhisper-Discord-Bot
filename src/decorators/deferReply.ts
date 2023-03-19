/**
 * Defers the interaction response then executes the function.
 * Caution is advised when using this command.
 * @param ephemeral Should the messages be hidden or not.
 */
import { ChatInputCommandInteraction } from "discord.js";

export function deferReply(
    ephemeral = false,
): ( target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor ) => PropertyDescriptor {
    return function( _target: object, _propertyKey: string | symbol, descriptor: PropertyDescriptor ) {
        const originalMethod = descriptor.value as (
            interaction: ChatInputCommandInteraction,
            ...args: unknown[]
        ) => Promise<unknown>;

        descriptor.value = async function( interaction: ChatInputCommandInteraction, ...args: unknown[] ) {
            const response = await interaction.deferReply( { ephemeral } );

            await originalMethod.apply( this, [ interaction, ...args ] );

            return response;
        };

        return descriptor;
    };
}
