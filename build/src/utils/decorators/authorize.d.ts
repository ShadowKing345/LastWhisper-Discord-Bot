import { ModuleBase } from "../objects/moduleBase.js";
/**
 * Decorator that wraps a function call with a permission check.
 * If the permission manager service is missing the function is called as if nothing happened.
 * @param key Names of the permission check key.
 */
export declare function authorize<T extends ModuleBase>(key: string): (target: T, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=authorize.d.ts.map