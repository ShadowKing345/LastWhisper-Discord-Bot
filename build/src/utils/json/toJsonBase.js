export class ToJsonBase {
    toJson() {
        return JSON.stringify(this);
    }
    fromJson(str) {
        return this.sanitizeJson(Object.assign(this, JSON.parse(str)));
    }
    sanitizeJson(obj) {
        return obj;
    }
}
//# sourceMappingURL=toJsonBase.js.map