import { constructor } from "tsyringe/dist/typings/types/index.js";
import { ModuleBase } from "../objects/moduleBase.js";
/**
 * Decorator that registers a module base class as a singleton of its own type and of token ModuleBase.name.
 */
export declare function registerModule<T extends ModuleBase>(): (target: constructor<T>) => void;
//# sourceMappingURL=registerModule.d.ts.map