import { Module } from "../../modules/module.js";
import { ContextMenuCommand as TContextMenuCommand } from "../../objects/index.js";
import { ModuleService } from "../../config/index.js";
import { CommandInteraction } from "discord.js";
import { CTR } from "../../utils/commonTypes.js";

/**
 * Decorator that attempts to register a context menu commands to the module service system.
 * Methods decorated with this command act as the executed method.
 * @param command A context menu command object excluding the callback value.
 */
export function ContextMenuCommand<T extends Module>( command: Partial<Omit<TContextMenuCommand, "callback">> ) {
    return function( target: unknown, _: string, descriptor: PropertyDescriptor ): PropertyDescriptor {
        ModuleService.registerContextMenuCommand( new TContextMenuCommand( {
            name: command.name,
            description: command.description,
            callback: descriptor.value as ( interaction: CommandInteraction ) => Promise<unknown>,
            type: command.type,
        } ), target.constructor as CTR<T> );

        return descriptor;
    };
}