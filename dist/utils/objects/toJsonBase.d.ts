import { MergeableObjectBase } from "./mergeableObjectBase.js";
export declare abstract class ToJsonBase<T> extends MergeableObjectBase<T> {
    toJson(): string;
    fromJson(str: string): T;
}
//# sourceMappingURL=toJsonBase.d.ts.map