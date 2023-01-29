import { container, injectable, Lifecycle } from "tsyringe";
import { Module } from "../modules/module.js";
export function module() {
    return function (target) {
        injectable()(target);
        container.register(target, target, { lifecycle: Lifecycle.ContainerScoped });
        container.register(Module.name, { useClass: target });
    };
}
//# sourceMappingURL=module.js.map