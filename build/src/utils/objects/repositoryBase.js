import { MergeableObjectBase } from "./mergeableObjectBase.js";
import { deepMerge } from "../index.js";
import { DatabaseError } from "../errors/DatabaseError.js";
/**
 * Base repository object.
 * Manages the majority of basic CRUD repository actions.
 */
export class RepositoryBase {
    db;
    // A private internal collection object.
    _collection;
    constructor(db) {
        this.db = db;
    }
    /**
     * Saves a new database record.
     * Returns the newly corrected record.
     * @param obj The object to save.
     * @return The newly created object.
     */
    async save(obj) {
        this.validateCollection();
        const result = await this.collection.findOneAndReplace({ _id: obj._id }, obj, { upsert: true });
        return result.ok ? this.map(result.value) : null;
    }
    /**
     * Finds the first instance of object given the filter.
     * @param filter Filter of the object.
     * @return The object or null if none was found.
     */
    async findOne(filter) {
        this.validateCollection();
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
    async findAll(filter) {
        this.validateCollection();
        return (await this.collection.find(filter).toArray()).map(obj => this.map(obj));
    }
    /**
     * Gets all records in the repository.
     * @return A collection of all the results.
     */
    getAll() {
        return this.findAll({});
    }
    /**
     * Performs a bulk save of object on the repository.
     * @param objs Collection of all the objects to save.
     */
    async bulkSave(objs) {
        this.validateCollection();
        if (objs.length <= 0)
            return;
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
    map(source) {
        const result = new this.sanitizedObject();
        if (result instanceof MergeableObjectBase) {
            return result.merge(source);
        }
        return deepMerge(result, source);
    }
    /**
     * Function that validates if a collection is present. Will throw an error if it does not exist.
     * @private
     * @throws DatabaseError
     */
    validateCollection() {
        if (!this.collection) {
            throw new DatabaseError("Could not find a collection. Please ensure one is assigned to the class.");
        }
    }
    /**
     * Gets the collection object for the class. Can be overwritten.
     * @protected
     * @throws DatabaseError
     */
    get collection() {
        if (!this.db.isConnected) {
            throw new DatabaseError("Unable to get collection. Are you sure the database is connected?");
        }
        return this._collection ??= this.db.db.collection(this.collectionName);
    }
}
//# sourceMappingURL=repositoryBase.js.map