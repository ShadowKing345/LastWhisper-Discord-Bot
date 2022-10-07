import { constructor } from "tsyringe/dist/typings/types/index.js";
import { container } from "tsyringe";
import { ModuleBase } from "../objects/moduleBase.js";

/**
 * Decorator that registers a module base class as a singleton of its own type and of token ModuleBase.name.
 */
export function registerModule<T>(): (target: constructor<T>) => void {
    return function (target: constructor<T>){
        container.registerSingleton(target);
        container.registerSingleton(ModuleBase.name, target);
    }
}