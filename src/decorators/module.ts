import { constructor } from "tsyringe/dist/typings/types/index.js";
import { container, injectable, Lifecycle } from "tsyringe";
import { Module } from "../modules/module.js";

/**
 * Decorator that registers a module base class as a singleton of its own type and of token ModuleBase.name.
 */
export function module<T extends Module>() {
    return function( target: constructor<T> ) {
        injectable()( target );
        container.register<T>( target, target, { lifecycle: Lifecycle.ResolutionScoped } );
        container.register( Module.name, { useClass: target } );
    };
}
