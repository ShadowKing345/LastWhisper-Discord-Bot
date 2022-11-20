import { constructor } from "tsyringe/dist/typings/types/index.js";
import { Service } from "../objects/service.js";
export declare function service<T extends Service<any>>(): (target: constructor<T>) => void;
//# sourceMappingURL=service.d.ts.map