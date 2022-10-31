import { MergeableObjectBase } from "./mergeableObjectBase.js";
export class ToJsonBase extends MergeableObjectBase {
    toJson() {
        return JSON.stringify(this);
    }
    fromJson(str) {
        return this.merge(JSON.parse(str));
    }
}
//# sourceMappingURL=toJsonBase.js.map