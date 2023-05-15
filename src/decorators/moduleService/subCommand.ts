import { CommandInteraction } from "discord.js";
import { Module } from "../../modules/module.js";
import { SlashGroupCommand, SlashSubCommand } from "../../objects/index.js";
import { Reflect } from "../../utils/reflect.js";

export function SubCommand<T extends Module>( command: Partial<Omit<SlashSubCommand, "callback"> | SlashGroupCommand> ) {
    return function( target: T, _: string, descriptor: PropertyDescriptor ): PropertyDescriptor {
        const subCommand = Reflect.getSubcommands( target.constructor );
        let c: SlashSubCommand | SlashGroupCommand;

        if( "subcommands" in command )
            c = new SlashGroupCommand( { subcommands: command.subcommands, } );
        else {
            c = new SlashSubCommand( { options: ( command as Partial<SlashSubCommand> ).options } );
        }
        
        c.merge( {
            name: command.name,
            description: command.description,
            callback: descriptor.value as ( interaction: CommandInteraction ) => Promise<unknown>
        } );

        subCommand.push( c );

        return descriptor;
    }
}