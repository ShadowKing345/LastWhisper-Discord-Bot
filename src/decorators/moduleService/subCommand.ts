import { ChatInputCommandInteraction } from "discord.js";
import { Module } from "../../modules/module.js";
import { SlashCommand } from "../../objects/index.js";

export function SubCommand<T extends Module>( command: Partial<Omit<SlashCommand, "callback">> ) {
    return function( target: T, _: string, descriptor: PropertyDescriptor ): PropertyDescriptor {
        const c = new SlashCommand( {
            name: command.name,
            description: command.description,
            callback: descriptor.value as ( interaction: ChatInputCommandInteraction ) => Promise<unknown>,
            subcommands: command.subcommands,
            options: command.options,
        } );

        if( !Reflect.hasMetadata( "module:subCommands", target.constructor ) ) {
            Reflect.defineMetadata( "module:subCommands", [], target.constructor );
        }

        ( Reflect.getMetadata( "module:subCommands", target.constructor ) as SlashCommand[] ).push( c );

        // if( "subCommands" in target && isArray( target.subCommands ) ) {
        //     target.subCommands.push( c );
        // } else {
        //     target["subCommands"] = [ c ];
        // }

        return descriptor;
    }
}