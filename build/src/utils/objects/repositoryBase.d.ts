import { Collection, Filter } from "mongodb";
/**
 * Entity interface to help with repository processing.
 */
export interface IEntity {
    _id: any;
}
/**
 * Base repository object.
 * Manages the majority of basic CRUD repository actions.
 */
export declare abstract class RepositoryBase<T extends IEntity> {
    protected abstract readonly collection: Collection<T>;
    protected abstract readonly sanitizedObject: {
        new (): T;
    };
    /**
     * Saves a new database record.
     * Returns the newly corrected record.
     * @param obj The object to save.
     * @return The newly created object.
     */
    save(obj: T): Promise<T>;
    /**
     * Finds the first instance of object given the filter.
     * @param filter Filter of the object.
     * @return The object or null if none was found.
     */
    findOne(filter: Filter<T>): Promise<T>;
    /**
     * Finds all instances of an object given a filter.
     * @param filter The filter for the object.
     * @return A collection of all the found objects if any.
     */
    findAll(filter: Filter<T>): Promise<T[]>;
    /**
     * Gets all records in the repository.
     * @return A collection of all the results.
     */
    getAll(): Promise<T[]>;
    /**
     * Performs a bulk save of object on the repository.
     * @param objs Collection of all the objects to save.
     */
    bulkSave(objs: T[]): Promise<void>;
    /**
     * Attempts to map an object by creating a new one.
     * @param source The source object
     * @return The newly created object.
     * @protected
     */
    protected map(source: object): T;
}
//# sourceMappingURL=repositoryBase.d.ts.map