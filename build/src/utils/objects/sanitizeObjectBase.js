/**
 * Abstract class that provides additional creation functions.
 */
export class SanitizeObjectBase {
    /**
     * Assigns all methods and functions into the current instance and returns it.
     * When extended it may perform additional steps in order to ensure the object was created properly.
     * @param newObj New object to assign values from.
     * @return Object with the assigned values.
     */
    merge(newObj) {
        return Object.assign(this, newObj);
    }
}
//# sourceMappingURL=sanitizeObjectBase.js.map