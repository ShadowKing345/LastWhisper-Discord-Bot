import { ToJsonBase } from "./toJsonBase.js";
export function toJson(t, str) {
    console.log(t instanceof ToJsonBase);
    if (t instanceof ToJsonBase) {
        return t.fromJson(str);
    }
    return Object.assign(t, JSON.parse(str));
}
//# sourceMappingURL=jsonUtils.js.map