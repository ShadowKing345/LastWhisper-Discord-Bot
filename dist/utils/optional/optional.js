import { NullValueError } from "../errors/index.js";
export class Optional {
    value;
    constructor(value = null) {
        this.value = value;
    }
    getValue() {
        if (!this.hasValue()) {
            throw new NullValueError("Attempted to get a null value from an IOptional object. Try using hasValue method before attempting this call.");
        }
        return this.value;
    }
    hasValue() {
        return this.value !== null;
    }
    map(mapper) {
        if (!this.hasValue()) {
            return new Optional(null);
        }
        const newValue = mapper(this.value);
        if (!newValue) {
            throw new NullValueError("Mapped value was null.");
        }
        return new Optional(newValue);
    }
}
//# sourceMappingURL=optional.js.map