import { constructor } from "tsyringe/dist/typings/types/index.js";
import { Service } from "../services/service.js";
export declare function service<T extends Service>(): (target: constructor<T>) => void;
//# sourceMappingURL=service.d.ts.map