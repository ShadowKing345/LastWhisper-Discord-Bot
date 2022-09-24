import { SanitizeObjectBase } from "./sanitizeObjectBase.js";

/**
 * Abstract class that acts as a base for quick JSON serialization and deserialization.
 */
export abstract class ToJsonBase extends SanitizeObjectBase {
    /**
     * Stringifies the current object into a JSON formatted string.
     * @return JSON string.
     */
    public toJson(): string {
        return JSON.stringify(this);
    }

    /**
     * Creates and object from a JSON string.
     * Calls the internal sanitize object function to ensure the object was created properly.
     * @param str The JSON string.
     * @return The newly created object.
     */
    public fromJson(str: string): object {
        return this.sanitizeObject(JSON.parse(str));
    }
}