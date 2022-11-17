import { MergeObjectBase } from "./mergeObjectBase.js";
export declare abstract class ToJsonBase<T> extends MergeObjectBase<T> {
    toJson(): string;
    fromJson(str: string): T;
}
//# sourceMappingURL=toJsonBase.d.ts.map