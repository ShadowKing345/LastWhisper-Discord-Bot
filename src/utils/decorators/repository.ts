import { constructor } from "tsyringe/dist/typings/types/index.js";
import { injectable, container } from "tsyringe";
import { Repository } from "../objects/repository.js";

/**
 * Decorator that registers a repository base class as a singleton of its own type and of token ModuleBase.name.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function repository<T extends Repository<any>>(): (target: constructor<T>) => void {
  return function(target: constructor<T>) {
    injectable()(target);
    container.registerSingleton<T>(target);
    container.register(Repository.name, { useClass: target });
  };
}
