import { constructor } from "tsyringe/dist/typings/types/index.js";
import { injectable, container } from "tsyringe";
import { Service } from "../../services/service.js";

/**
 * Decorator that registers a service base class as a singleton of its own type and of token ModuleBase.name.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function service<T extends Service<any>>(): (target: constructor<T>) => void {
  return function (target: constructor<T>) {
    injectable()(target);
    container.registerSingleton<T>(target);
    container.register(Service.name, { useClass: target });
  };
}
