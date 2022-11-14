import { Collection, Filter } from "mongodb";

import { MergeObjectBase } from "./mergeObjectBase.js";
import { deepMerge } from "../index.js";
import { DatabaseError } from "../errors/index.js";
import { DatabaseConfigurationService } from "../config/databaseConfigurationService.js";

/**
 * Entity interface to help with repository processing.
 */
export interface IEntity<T> {
  _id: T;
  guildId: string;
}

/**
 * Base repository object.
 * Manages the majority of basic CRUD repository actions.
 */
export abstract class RepositoryBase<T extends MergeObjectBase<T> & IEntity<unknown>> {
  // Name of the collection.
  protected abstract readonly collectionName: string;
  // A private internal collection object.
  private _collection: Collection<T> = null;
  // A class to create a new object.
  protected abstract readonly mappingObject: { new (): T };

  protected constructor(protected db: DatabaseConfigurationService) {}

  /**
   * Saves a new database record.
   * Returns the newly corrected record.
   * @param obj The object to save.
   * @return The newly created object.
   */
  public async save(obj: T): Promise<T> {
    this.validateCollection();
    const result = await this.collection.findOneAndReplace({ _id: obj._id }, obj, { upsert: true });
    return result.ok ? this.map(result.value as T) : null;
  }

  /**
   * Finds the first instance of object given the filter.
   * @param filter Filter of the object.
   * @return The object or null if none was found.
   */
  public async findOne(filter: Filter<T>): Promise<T> {
    this.validateCollection();

    // see https://jira.mongodb.org/browse/NODE-723 as to why I am doing a find one like this.
    const result = await this.collection.find(filter).batchSize(1).next();
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
    this.validateCollection();
    return (await this.collection.find(filter).toArray()).map((obj) => this.map(obj));
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
    this.validateCollection();
    if (objs.length <= 0) return;

    const bulk = this.collection.initializeOrderedBulkOp();
    objs.forEach((config) => bulk.find({ _id: config._id }).upsert().replaceOne(config));

    await bulk.execute();
  }

  /**
   * Attempts to map an object by creating a new one.
   * @param source The source object
   * @return The newly created object.
   * @protected
   */
  protected map(source: object): T {
    const result = new this.mappingObject();

    return result instanceof MergeObjectBase ? result.merge(source) : deepMerge(result, source);
  }

  /**
   * Function that validates if a collection is present. Will throw an error if it does not exist.
   * @private
   * @throws DatabaseError
   */
  private validateCollection() {
    if (!this.collection) {
      throw new DatabaseError("Could not find a collection. Please ensure one is assigned to the class.");
    }
  }

  /**
   * Gets the collection object for the class. Can be overwritten.
   * @protected
   * @throws DatabaseError
   */
  protected get collection(): Collection<T> {
    if (!this.db.isConnected) {
      throw new DatabaseError("Unable to get collection. Are you sure the database is connected?");
    }

    return (this._collection ??= this.db.db?.collection<T>(this.collectionName));
  }
}
