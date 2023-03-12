import { Command, CommandOptions, HookEvent, Option, program as gloProgram } from "commander";
import { isArray } from "../utils/index.js";

export class Commander {
    public static addCommand<T>( obj: Partial<CommandOpts> | Command, program: Command = gloProgram ) {
        return function( target: T, _: string | symbol, descriptor: PropertyDescriptor ): PropertyDescriptor {

            if( obj instanceof Command ) {
                program.addCommand( obj );
                obj.action( ( descriptor.value as ( ...args: unknown[] ) => void | Promise<void> ).bind( target ) );
            } else {
                const command = program
                    .command( obj.name, obj.opts )
                    .description( obj.description );

                if( "arguments" in obj && isArray( obj.arguments ) ) {
                    for(const argument of obj.arguments) {
                        command.argument( argument.name, argument.description, argument.defaultValue );
                    }
                }

                if( obj.options && isArray( obj.options ) ) {
                    for( const opt of obj.options ) {
                        if( opt instanceof Option ) {
                            command.addOption( opt );
                        } else {
                            command.option( opt.definition, opt.description );
                        }
                    }
                }

                command.action( ( descriptor.value as ( ...args: unknown[] ) => void | Promise<void> ).bind( target ) );
            }
            
            return descriptor;
        };
    }

    public static hook<T>( event: HookEvent, program: Command = gloProgram ) {
        return function( target: T, _, descriptor: PropertyDescriptor ): PropertyDescriptor {
            program.hook( event, ( descriptor.value as ( command: Command, actionCommand: Command ) => void | Promise<void> ).bind( target ) );

            return descriptor;
        };
    }
}

export class CommandOpts {
    name: string;
    description: string;
    arguments: {name: string, description?: string, defaultValue?: unknown}[];
    opts?: CommandOptions;
    options?: Array<{ definition: string, description: string } | Option> = [];
}