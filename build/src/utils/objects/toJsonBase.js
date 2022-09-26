import { SanitizeObject } from "./sanitizeObject.js";
/**
 * Abstract class that acts as a base for quick JSON serialization and deserialization.
 */
export class ToJsonBase extends SanitizeObject {
    /**
     * Stringifies the current object into a JSON formatted string.
     * @return JSON string.
     */
    toJson() {
        return JSON.stringify(this);
    }
    /**
     * Creates and object from a JSON string.
     * Calls the internal sanitize object function to ensure the object was created properly.
     * @param str The JSON string.
     * @return The newly created object.
     */
    fromJson(str) {
        return this.sanitizeObject(JSON.parse(str));
    }
}
//# sourceMappingURL=toJsonBase.js.map