import { ChatInputCommandInteraction } from "discord.js";
import { Module } from "../../modules/module.js";
import { SlashCommand } from "../../objects/index.js";
import { Reflect } from "../../utils/reflect.js";

export function SubCommand<T extends Module>( command: Partial<Omit<SlashCommand, "callback">> ) {
    return function( target: T, _: string, descriptor: PropertyDescriptor ): PropertyDescriptor {
        const c = new SlashCommand( {
            name: command.name,
            description: command.description,
            callback: descriptor.value as ( interaction: ChatInputCommandInteraction ) => Promise<unknown>,
            subcommands: command.subcommands,
            options: command.options,
        } );
        Reflect.getSubcommands( target.constructor ).push( c );

        return descriptor;
    }
}