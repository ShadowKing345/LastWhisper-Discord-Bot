import { constructor } from "tsyringe/dist/typings/types/index.js";
import { container, injectable, Lifecycle } from "tsyringe";
import { ModuleService } from "../config/index.js";
import { Module } from "../modules/module.js";
import { SlashCommand } from "../objects/index.js";
import { DecoratorError } from "../utils/errors/index.js";
import { isArray } from "../utils/index.js";
import { Reflect } from "../utils/reflect.js";

/**
 * Decorator that registers a module base class as a singleton of its own type and of token ModuleBase.name.
 */
export function module<T extends Module>( args: { moduleName?: string, baseCommand?: Partial<Omit<SlashCommand, "callback">> } = {} ) {
    return function( target: constructor<T> ) {
        if( args.baseCommand ) {
            const subCommands: unknown = Reflect.getSubcommands( target );
            const base = args.baseCommand;

            if( !( subCommands && isArray( subCommands ) && subCommands.length > 0 ) ) {
                throw new DecoratorError( "You must include subCommands if you want to use the baseCommand option." );
            }

            const command = new SlashCommand( {
                name: base.name,
                description: base.description,
                subcommands: subCommands,
            } );

            ModuleService.registerSlashCommand( command, target );
        }

        if( args.moduleName ) {
            Reflect.setModuleName(args.moduleName, target);
        }

        injectable()( target );
        container.register<T>( target, target, { lifecycle: Lifecycle.ResolutionScoped } );
        container.register( Module.name, { useClass: target } );
    };
}
