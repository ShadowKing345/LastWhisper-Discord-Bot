import { ModuleService } from "../config/index.js";
import { EventListener } from "../objects/index.js";
export function Event(event) {
    return function (target, _, descriptor) {
        ModuleService.registerEventListener(new EventListener(event, descriptor.value), target.constructor);
        return descriptor;
    };
}
//# sourceMappingURL=event.js.map