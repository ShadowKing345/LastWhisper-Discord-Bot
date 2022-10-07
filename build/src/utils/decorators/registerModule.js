import { container, injectable } from "tsyringe";
import { ModuleBase } from "../objects/moduleBase.js";
/**
 * Decorator that registers a module base class as a singleton of its own type and of token ModuleBase.name.
 */
export function registerModule() {
    return function (target) {
        injectable()(target);
        container.registerSingleton(target);
        container.register(ModuleBase.name, { useClass: target });
    };
}
//# sourceMappingURL=registerModule.js.map