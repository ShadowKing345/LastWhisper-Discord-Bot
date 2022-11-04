import { MergeableObjectBase } from "./mergeableObjectBase.js";
import { deepMerge } from "../index.js";
import { DatabaseError } from "../errors/DatabaseError.js";
export class RepositoryBase {
    db;
    _collection = null;
    constructor(db) {
        this.db = db;
    }
    async save(obj) {
        this.validateCollection();
        const result = await this.collection.findOneAndReplace({ _id: obj._id }, obj, { upsert: true });
        return result.ok ? this.map(result.value) : null;
    }
    async findOne(filter) {
        this.validateCollection();
        const result = await this.collection.find(filter).batchSize(1).next();
        if (!result) {
            return null;
        }
        return this.map(result);
    }
    async findAll(filter) {
        this.validateCollection();
        return (await this.collection.find(filter).toArray()).map((obj) => this.map(obj));
    }
    getAll() {
        return this.findAll({});
    }
    async bulkSave(objs) {
        this.validateCollection();
        if (objs.length <= 0)
            return;
        const bulk = this.collection.initializeOrderedBulkOp();
        objs.forEach((config) => bulk.find({ _id: config._id }).upsert().replaceOne(config));
        await bulk.execute();
    }
    map(source) {
        const result = new this.mappingObject();
        return result instanceof MergeableObjectBase ? result.merge(source) : deepMerge(result, source);
    }
    validateCollection() {
        if (!this.collection) {
            throw new DatabaseError("Could not find a collection. Please ensure one is assigned to the class.");
        }
    }
    get collection() {
        if (!this.db.isConnected) {
            throw new DatabaseError("Unable to get collection. Are you sure the database is connected?");
        }
        return (this._collection ??= this.db.db?.collection(this.collectionName));
    }
}
//# sourceMappingURL=repositoryBase.js.map