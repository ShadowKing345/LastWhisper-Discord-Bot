import { constructor } from "tsyringe/dist/typings/types/index.js";
import { container, injectable } from "tsyringe";
import { ModuleBase } from "../objects/moduleBase.js";

/**
 * Decorator that registers a module base class as a singleton of its own type and of token ModuleBase.name.
 */
export function registerModule<T extends ModuleBase>(): (
  target: constructor<T>
) => void {
  return function (target: constructor<T>) {
    injectable()(target);
    container.registerSingleton<T>(target);
    container.register(ModuleBase.name, { useClass: target });
  };
}
