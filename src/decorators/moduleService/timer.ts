import { Module } from "../../modules/module.js";
import { ModuleService } from "../../config/index.js";
import { Bot } from "../../objects/index.js";
import { Timer as TimerObject } from "../../objects/timer.js";
import { CTR } from "../../utils/commonTypes.js";

/**
 * Decorator that attempts to register a timer to the module service system.
 * Methods decorated with this command act as the executed method.
 * @param timer Timer object, excluding the callback value.
 */
export function Timer<T extends Module>( timer: Omit<TimerObject, "execute"> ) {
    return function( target: unknown, _: string, descriptor: PropertyDescriptor ): PropertyDescriptor {
        ModuleService.registerTimer( {
            name: timer.name,
            timeout: timer.timeout,
            execute: descriptor.value as ( client: Bot ) => Promise<unknown>,
        }, target.constructor as CTR<T> );

        return descriptor;
    };
}