import { Module } from "../objects/module.js";
export declare function authorize<T extends Module>(key: string): (target: T, propertyKey: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=authorize.d.ts.map