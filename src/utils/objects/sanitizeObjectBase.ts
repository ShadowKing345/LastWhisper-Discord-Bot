/**
 * Abstract class that provides additional creation functions.
 */
export abstract class SanitizeObjectBase<T> {
    /**
     * Assigns all methods and functions into the current instance and returns it.
     * When extended it may perform additional steps in order to ensure the object was created properly.
     * @param newObj New object to assign values from.
     * @return Object with the assigned values.
     */
    public sanitizeObject(newObj: T): T {
        return Object.assign(this, newObj);
    }
}