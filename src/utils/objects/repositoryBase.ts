import { Collection, Filter } from "mongodb";

import { SanitizeObjectBase } from "./sanitizeObjectBase.js";
import { deepMerge } from "../index.js";

/**
 * Entity interface to help with repository processing.
 */
export interface IEntity {
    _id;
}

/**
 * Base repository object.
 * Manages the majority of basic CRUD repository actions.
 */
export abstract class RepositoryBase<T extends IEntity> {
    // The actual collection to use.
    protected abstract readonly collection: Collection<T>;
    // A class to create a new object.
    protected abstract readonly sanitizedObject: { new(): T };

    /**
     * Saves a new database record.
     * Returns the newly corrected record.
     * @param obj The object to save.
     * @return The newly created object.
     */
    public async save(obj: T): Promise<T> {
        const result = await this.collection.findOneAndReplace({ _id: obj._id }, obj, { upsert: true });
        return result.ok ? this.map(result.value) : null;
    }

    /**
     * Finds the first instance of object given the filter.
     * @param filter Filter of the object.
     * @return The object or null if none was found.
     */
    public async findOne(filter: Filter<T>): Promise<T> {
        // For some reason due to the void call Webstorm is having issues seeing this method call.
        // noinspection JSVoidFunctionReturnValueUsed
        const result = await this.collection.findOne(filter);

        if (!result) {
            return null;
        }

        return this.map(result);
    }

    /**
     * Finds all instances of an object given a filter.
     * @param filter The filter for the object.
     * @return A collection of all the found objects if any.
     */
    public async findAll(filter: Filter<T>): Promise<T[]> {
        return (await this.collection.find(filter).toArray()).map(obj => this.map(obj));
    }

    /**
     * Gets all records in the repository.
     * @return A collection of all the results.
     */
    public getAll(): Promise<T[]> {
        return this.findAll({});
    }

    /**
     * Performs a bulk save of object on the repository.
     * @param objs Collection of all the objects to save.
     */
    public async bulkSave(objs: T[]): Promise<void> {
        if (objs.length <= 0) return;

        const bulk = this.collection.initializeOrderedBulkOp();
        objs.forEach(config => bulk.find({ _id: config._id }).upsert().replaceOne(config));

        await bulk.execute();
    }

    /**
     * Attempts to map an object by creating a new one.
     * @param source The source object
     * @return The newly created object.
     * @protected
     */
    protected map(source: object): T {
        const result = new this.sanitizedObject();

        if (result instanceof SanitizeObjectBase) {
            return result.sanitizeObject(source);
        }

        return deepMerge(result, source);
    }
}