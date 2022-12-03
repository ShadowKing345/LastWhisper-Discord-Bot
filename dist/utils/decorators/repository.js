import { injectable, container } from "tsyringe";
import { Repository } from "../../repositories/repository.js";
export function repository() {
    return function (target) {
        injectable()(target);
        container.registerSingleton(target);
        container.register(Repository.name, { useClass: target });
    };
}
//# sourceMappingURL=repository.js.map