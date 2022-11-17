import { injectable, container } from "tsyringe";
import { Service } from "../objects/service.js";
export function service() {
    return function (target) {
        injectable()(target);
        container.registerSingleton(target);
        container.register(Service.name, { useClass: target });
    };
}
//# sourceMappingURL=service.js.map