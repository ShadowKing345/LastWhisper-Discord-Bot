import { container, injectable } from "tsyringe";
import { Module } from "../../modules/module.js";
export function module() {
    return function (target) {
        injectable()(target);
        container.registerSingleton(target);
        container.register(Module.name, { useClass: target });
    };
}
//# sourceMappingURL=module.js.map