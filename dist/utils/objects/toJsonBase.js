import { MergeObjectBase } from "./mergeObjectBase.js";
export class ToJsonBase extends MergeObjectBase {
    toJson() {
        return JSON.stringify(this);
    }
    fromJson(str) {
        return this.merge(JSON.parse(str));
    }
}
//# sourceMappingURL=toJsonBase.js.map