/**
 * Abstract class that provides additional creation functions.
 */
export declare abstract class MergeableObjectBase<T> {
    /**
     * Override function merging two objects of the same class.
     * When extended it may perform additional steps in order to ensure the object was created properly.
     * @param obj New object to assign values from.
     * @return Object with the assigned values.
     */
    merge(obj: Partial<T>): T;
}
//# sourceMappingURL=mergeableObjectBase.d.ts.map