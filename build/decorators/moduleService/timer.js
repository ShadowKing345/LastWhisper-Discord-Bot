import { ModuleService } from "../../config/index.js";
export function Timer(timer) {
    return function (target, _, descriptor) {
        ModuleService.registerTimer({
            name: timer.name,
            timeout: timer.timeout,
            execute: descriptor.value,
        }, target.constructor);
        return descriptor;
    };
}
//# sourceMappingURL=timer.js.map