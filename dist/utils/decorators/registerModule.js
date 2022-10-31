import { container, injectable } from "tsyringe";
import { ModuleBase } from "../objects/moduleBase.js";
export function registerModule() {
    return function (target) {
        injectable()(target);
        container.registerSingleton(target);
        container.register(ModuleBase.name, { useClass: target });
    };
}
//# sourceMappingURL=registerModule.js.map