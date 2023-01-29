import { injectable, container, Lifecycle } from "tsyringe";
import { Service } from "../services/service.js";
export function service() {
    return function (target) {
        injectable()(target);
        container.register(target, target, { lifecycle: Lifecycle.ResolutionScoped });
        container.register(Service.name, { useClass: target });
    };
}
//# sourceMappingURL=service.js.map