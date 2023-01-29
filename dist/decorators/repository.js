import { injectable, container, Lifecycle } from "tsyringe";
import { Repository } from "../repositories/base/repository.js";
export function repository() {
    return function (target) {
        injectable()(target);
        container.register(target, target, { lifecycle: Lifecycle.ResolutionScoped });
        container.register(Repository.name, { useClass: target });
    };
}
//# sourceMappingURL=repository.js.map